"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const relation_enum_1 = require("../enum/relation.enum");
const sub_task_enum_1 = require("../enum/sub-task.enum");
const project_repository_1 = require("../project/project.repository");
const task_repository_1 = require("../task/task.repository");
let AnalysisService = class AnalysisService {
    constructor(taskRepository, projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }
    async getRootTodo(user, projectId) {
        const projectQuery = this.projectRepository.createQueryBuilder("project");
        projectQuery
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .where("project.id = :projectId", { projectId });
        const project = await projectQuery.getOne();
        if (!project) {
            throw new common_1.NotFoundException(`Project with id ${projectId} is not found.`);
        }
        if (project.userToProjects.length === 0) {
            throw new common_1.UnauthorizedException(`User ${user.email} is not member of the project with id ${projectId}.`);
        }
        if (project.type !== sub_task_enum_1.SubTask.GRAPH) {
            throw new common_1.NotAcceptableException(`User ${user.email} can get todo list of the only graph project. This project is ${project.type}`);
        }
        const rootsQuery = this.taskRepository.createQueryBuilder("task");
        rootsQuery
            .leftJoinAndSelect("task.predecessors", "predecessors")
            .leftJoinAndSelect("task.successors", "successors")
            .leftJoinAndSelect("task.members", "members", "members.id = :userId", { userId: user.id })
            .where("task.parentId IS NULL")
            .andWhere("task.projectId = :projectId", { projectId });
        const roots = await rootsQuery.getMany();
        const count = roots.length;
        if (count === 0) {
            return { todo: new Array(), cycles: new Array() };
        }
        const cycles = await this.getCycles(roots);
        if (cycles.length >= 1) {
            return { todo: new Array(), cycles };
        }
        const indexes = new Map();
        for (let i = 0; i < count; ++i) {
            indexes.set(roots[i].id, i);
        }
        const discovered = new Set();
        const todoNum = new Array();
        for (let i = 0; i < count; ++i) {
            if (discovered.has(i)) {
                continue;
            }
            this.postOrderingRecursive(roots, indexes, i, discovered, todoNum);
        }
        const todo = new Array();
        for (const taskNum of todoNum) {
            todo.push(roots[taskNum]);
        }
        return { todo, cycles: new Array() };
    }
    async getTodo(user, parentId) {
        const parentQuery = this.taskRepository.createQueryBuilder("task");
        parentQuery
            .leftJoinAndSelect("task.project", "project")
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .leftJoinAndSelect("task.children", "children")
            .leftJoinAndSelect("children.predecessors", "predecessors")
            .leftJoinAndSelect("children.successors", "successors")
            .leftJoinAndSelect("children.members", "members", "members.id = :userId", { userId: user.id })
            .where("task.id = :parentId", { parentId });
        const parent = await parentQuery.getOne();
        if (!parent) {
            throw new common_1.NotFoundException(`The parent task with id ${parent} is not found.`);
        }
        if (parent.project.userToProjects.length === 0) {
            throw new common_1.UnauthorizedException(`User ${user.email} is not member of the project with id ${parent.project.id}.`);
        }
        if (parent.type !== sub_task_enum_1.SubTask.GRAPH) {
            throw new common_1.NotAcceptableException(`User ${user.email} can get todo list of the only graph project. This task is ${parent.type}`);
        }
        const children = parent.children;
        const count = children.length;
        if (count === 0) {
            return { todo: new Array(), cycles: new Array() };
        }
        const cycles = await this.getCycles(children);
        if (cycles.length >= 1) {
            return { todo: new Array(), cycles };
        }
        const indexes = new Map();
        for (let i = 0; i < count; ++i) {
            indexes.set(children[i].id, i);
        }
        const discovered = new Set();
        const todoNum = new Array();
        for (let i = 0; i < count; ++i) {
            if (discovered.has(i)) {
                continue;
            }
            this.postOrderingRecursive(children, indexes, i, discovered, todoNum);
        }
        const todo = new Array();
        for (const taskNum of todoNum) {
            todo.push(children[taskNum]);
        }
        return { todo, cycles: new Array() };
    }
    async getRelation(user, firstTaskId, secondTaskId) {
        const firstQuery = this.taskRepository.createQueryBuilder("task");
        firstQuery
            .leftJoinAndSelect("task.parent", "parent")
            .leftJoinAndSelect("task.project", "project")
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .where("task.id = :taskId", { taskId: firstTaskId });
        const firstTask = await firstQuery.getOne();
        if (!firstTask) {
            throw new common_1.NotFoundException(`The first task ${firstTaskId} is not found.`);
        }
        if (firstTask.project.userToProjects.length === 0) {
            throw new common_1.UnauthorizedException(`User ${user.email} is not member of the project ${firstTask.project.id}`);
        }
        const secondQuery = this.taskRepository.createQueryBuilder("task");
        secondQuery
            .leftJoinAndSelect("task.parent", "parent")
            .leftJoinAndSelect("task.project", "project")
            .where("task.id = :taskId", { taskId: secondTaskId });
        const secondTask = await secondQuery.getOne();
        if (!secondTask) {
            throw new common_1.NotFoundException(`The second task ${secondTaskId} is not found.`);
        }
        if (!((firstTask.parent && secondTask.parent && firstTask.parent.id === secondTask.parent.id) ||
            (!firstTask.parent && !secondTask.parent && firstTask.project.id === secondTask.project.id))) {
            throw new common_1.NotAcceptableException(`The first task ${firstTaskId} and second task ${secondTaskId} has different parent.`);
        }
        const childrenQuery = this.taskRepository.createQueryBuilder("task");
        childrenQuery.leftJoinAndSelect("task.successors", "successors");
        if (firstTask.parent) {
            childrenQuery.where("task.parentId = :parentId", { parentId: firstTask.parent.id });
        }
        else {
            childrenQuery
                .where("task.projectId = :projectId", { projectId: firstTask.project.id })
                .andWhere("task.parent IS NULL");
        }
        const children = await childrenQuery.getMany();
        const indexes = new Map();
        for (let i = 0; i < children.length; ++i) {
            indexes.set(children[i].id, i);
        }
        const discovered = new Set();
        const successors = new Set();
        const stack = new Array();
        const firstTaskNum = indexes.get(firstTask.id);
        stack.push(firstTaskNum);
        discovered.add(firstTaskNum);
        while (stack.length !== 0) {
            const next = stack.pop();
            successors.add(next);
            for (const successor of children[next].successors) {
                const successorNum = indexes.get(successor.id);
                if (!discovered.has(successorNum)) {
                    stack.push(successorNum);
                    discovered.add(successorNum);
                }
            }
        }
        const secondTaskNum = indexes.get(secondTask.id);
        if (successors.has(secondTaskNum)) {
            return { relation: relation_enum_1.Relation.FIRST };
        }
        discovered.clear();
        successors.clear();
        stack.length = 0;
        stack.push(secondTaskNum);
        discovered.add(secondTaskNum);
        while (stack.length !== 0) {
            const next = stack.pop();
            successors.add(next);
            for (const successor of children[next].successors) {
                const successorNum = indexes.get(successor.id);
                if (!discovered.has(successorNum)) {
                    stack.push(successorNum);
                    discovered.add(successorNum);
                }
            }
        }
        if (successors.has(firstTaskNum)) {
            return { relation: relation_enum_1.Relation.LATER };
        }
        return { relation: relation_enum_1.Relation.NO };
    }
    async getMemberTasksInRoot(user, projectId, memberId) {
        const projectQuery = this.projectRepository.createQueryBuilder("project");
        projectQuery
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId OR userToProjects.userId = :memberId", { userId: user.id, memberId })
            .where("project.id = :projectId", { projectId });
        const project = await projectQuery.getOne();
        if (!project) {
            throw new common_1.NotFoundException(`The project ${projectId} is not found.`);
        }
        if (project.userToProjects.length < 2) {
            throw new common_1.NotFoundException(`The user ${user.id} or ${memberId} is not found in this project.`);
        }
        const yourTaskQuery = this.taskRepository.createQueryBuilder("task");
        yourTaskQuery
            .innerJoin("task.members", "members", "members.id = :memberId", { memberId })
            .where("task.parent IS NULL")
            .andWhere("task.projectId = :projectId", { projectId });
        const yourTasks = await yourTaskQuery.getMany();
        const myTaskQuery = this.taskRepository.createQueryBuilder("task");
        myTaskQuery
            .innerJoin("task.members", "members", "members.id = :userId", { userId: user.id })
            .where("task.parent IS NULL")
            .andWhere("task.projectId = :projectId", { projectId });
        const myTasks = await myTaskQuery.getMany();
        const intersection = myTasks.filter((myTask) => {
            for (const yourTask of yourTasks) {
                if (myTask === yourTask) {
                    return true;
                }
            }
        });
        return { myTasks, yourTasks, intersection };
    }
    async getMemberTasks(user, parentId, memberId) {
        const parentQuery = this.taskRepository.createQueryBuilder("task");
        parentQuery
            .leftJoinAndSelect("task.project", "project")
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId OR userToProjects.userId = :memberId", { userId: user.id, memberId })
            .where(`task.id = :parentId`, { parentId });
        const parent = await parentQuery.getOne();
        if (!parent) {
            throw new common_1.NotFoundException(`The parent task ${parentId} is not found`);
        }
        if (parent.project.userToProjects.length < 2) {
            throw new common_1.NotFoundException(`The user ${user.id} or ${memberId} is not found in this project.`);
        }
        const yourTaskQuery = this.taskRepository.createQueryBuilder("task");
        yourTaskQuery
            .innerJoin("task.members", "members", "members.id = :memberId", { memberId })
            .where("task.parentId = :parentId", { parentId });
        const yourTasks = await yourTaskQuery.getMany();
        const myTaskQuery = this.taskRepository.createQueryBuilder("task");
        myTaskQuery
            .innerJoin("task.members", "members", "members.id = :userId", { userId: user.id })
            .where("task.parentId = :parentId", { parentId });
        const myTasks = await myTaskQuery.getMany();
        const intersection = myTasks.filter((myTask) => {
            for (const yourTask of yourTasks) {
                if (myTask === yourTask) {
                    return true;
                }
            }
        });
        return { myTasks, yourTasks, intersection };
    }
    async getCycles(tasks) {
        const count = tasks.length;
        if (count === 0) {
            return new Array();
        }
        const indexes = new Map();
        for (let i = 0; i < count; ++i) {
            indexes.set(tasks[i].id, i);
        }
        const isVisited = new Array(count).fill(false);
        const isFinished = new Array(count).fill(false);
        const stack = new Array();
        const sccNum = new Array();
        const scc = new Array();
        const dfs = function (vertex) {
            let parent = vertex;
            isVisited[vertex] = true;
            stack.push(vertex);
            for (let i = 0; i < tasks[vertex].successors.length; ++i) {
                const nextVer = tasks[vertex].successors[i];
                const nextVerIdx = indexes.get(nextVer.id);
                if (!isVisited[nextVerIdx]) {
                    parent = Math.min(parent, dfs(nextVerIdx));
                }
                else if (!isFinished[nextVerIdx]) {
                    parent = nextVerIdx;
                }
            }
            if (parent === vertex) {
                const sccEl = new Array();
                let topEl = 0;
                do {
                    topEl = stack.pop();
                    isFinished[topEl] = true;
                    sccEl.unshift(topEl);
                } while (topEl !== parent);
                sccNum.push(sccEl);
            }
            return parent;
        };
        for (let vertex = 0; vertex < count; ++vertex) {
            if (!isFinished[vertex]) {
                dfs(vertex);
            }
        }
        for (const el of sccNum) {
            if (el.length <= 1) {
                continue;
            }
            const sccEl = new Set();
            for (const taskIdx of el) {
                sccEl.add(tasks[taskIdx]);
            }
            scc.push(sccEl);
        }
        return scc;
    }
    postOrderingRecursive(tasks, indexes, task, discovered, todo) {
        discovered.add(task);
        for (const predecessor of tasks[task].predecessors) {
            const preNum = indexes.get(predecessor.id);
            if (discovered.has(preNum)) {
                continue;
            }
            this.postOrderingRecursive(tasks, indexes, preNum, discovered, todo);
        }
        todo.push(task);
    }
};
AnalysisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_repository_1.TaskRepository)),
    __param(1, (0, typeorm_1.InjectRepository)(project_repository_1.ProjectRepository)),
    __metadata("design:paramtypes", [task_repository_1.TaskRepository,
        project_repository_1.ProjectRepository])
], AnalysisService);
exports.AnalysisService = AnalysisService;
//# sourceMappingURL=analysis.service.js.map