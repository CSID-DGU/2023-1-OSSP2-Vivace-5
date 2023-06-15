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
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const task_repository_1 = require("./task.repository");
const task_entity_1 = require("../entity/task.entity");
const project_repository_1 = require("../project/project.repository");
const user_right_enum_1 = require("../enum/user-right.enum");
const sub_task_enum_1 = require("../enum/sub-task.enum");
const user_repository_1 = require("../user/user.repository");
const bookmark_repository_1 = require("./bookmark.repository");
const kanban_column_repository_1 = require("./kanban-column.repository");
const bookmark_entity_1 = require("../entity/bookmark.entity");
const typeorm_2 = require("typeorm");
const task_content_repository_1 = require("./task-content.repository");
const task_content_entity_1 = require("../entity/task-content.entity");
let TaskService = class TaskService {
    constructor(taskRepository, projectRepository, userRepository, bookmarkRepository, kanbanColumnRepository, taskContentRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.kanbanColumnRepository = kanbanColumnRepository;
        this.taskContentRepository = taskContentRepository;
    }
    async getTaskInfo(user, taskId) {
        const taskQuery = this.taskRepository.createQueryBuilder("task");
        taskQuery
            .select(["task", "members.id", "members.encodedImg"])
            .leftJoinAndSelect("task.project", "project")
            .leftJoinAndSelect("task.childColumns", "childColumns")
            .leftJoinAndSelect("task.parentColumn", "parentColumn")
            .leftJoinAndSelect("task.parent", "parent")
            .leftJoinAndSelect("task.children", "children")
            .leftJoinAndSelect("children.bookmarks", "cb", "cb.userId = :userId", { userId: user.id })
            .leftJoinAndSelect("children.predecessors", "predecessors")
            .leftJoinAndSelect("children.successors", "successors")
            .leftJoin("task.members", "members")
            .leftJoinAndSelect("members.userToProjects", "mu")
            .leftJoinAndSelect("task.contents", "contents")
            .leftJoinAndSelect("task.comments", "comments")
            .leftJoinAndSelect("project.userToProjects", "userToProjects")
            .leftJoinAndSelect("task.bookmarks", "bookmarks", "bookmarks.userId = :userId", { userId: user.id })
            .where("task.id = :taskId", { taskId });
        const found = await taskQuery.getOne();
        if (!found) {
            throw new common_1.NotFoundException(`The task with id ${taskId} is not found.`);
        }
        for (const task of found.children) {
            let descendants = await this.taskRepository.findDescendants(task);
            let nowGoal = 0;
            for (const descendant of descendants) {
                if (descendant.isFinished) {
                    ++nowGoal;
                }
            }
            task.rate = nowGoal / descendants.length;
        }
        return found;
    }
    async createTask(user, createTaskDto) {
        const { projectId, parentId, isKanban, title, description, type, start, deadline } = createTaskDto;
        if (isKanban && !parentId) {
            throw new common_1.NotAcceptableException(`If the parent task is a Kanban board, the column id must be specified.`);
        }
        const projectQuery = this.projectRepository.createQueryBuilder("project");
        projectQuery.leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        });
        if (isKanban) {
            projectQuery
                .leftJoinAndSelect("project.columns", "columns", "columns.id = :parentId", { parentId })
                .leftJoinAndSelect("columns.parent", "parent");
        }
        else {
            projectQuery.leftJoinAndSelect("project.tasks", "tasks", "tasks.id = :parentId", { parentId });
        }
        projectQuery.where("project.id = :projectId", { projectId });
        const project = await projectQuery.getOne();
        if (!project) {
            throw new common_1.NotFoundException(`The project with id ${projectId} is not found.`);
        }
        if (!project.userToProjects[0]) {
            throw new common_1.UnauthorizedException(`The user ${user.email} is not member of this project with id ${projectId}`);
        }
        if (project.userToProjects[0].right === user_right_enum_1.UserRight.COMPLETION_MOD ||
            project.userToProjects[0].right === user_right_enum_1.UserRight.MEMBER_MGT) {
            throw new common_1.UnauthorizedException(`The user ${user.email} has insufficient permissions in this project with id ${projectId}`);
        }
        let last = null;
        if (parentId) {
            if (isKanban) {
                if (!project.columns[0]) {
                    throw new common_1.NotFoundException(`The column with id ${parentId} is not found in this project with id ${projectId}.`);
                }
                const columnTaskQuery = this.taskRepository.createQueryBuilder("task");
                columnTaskQuery
                    .leftJoin("task.successors", "successors")
                    .where("task.parentColumnId = :parentId", { parentId })
                    .having("COUNT(successors) = :count", { count: 0 });
                last = await columnTaskQuery.getOne();
            }
            else {
                if (!project.tasks[0]) {
                    throw new common_1.NotFoundException(`The parent task with id ${parentId} is not found in this project with id ${projectId}.`);
                }
                if (project.tasks[0].type === sub_task_enum_1.SubTask.KANBAN) {
                    throw new common_1.BadRequestException(`The parent task with id ${parentId} cannot be the type of kanban board.`);
                }
                if (project.tasks[0].type === sub_task_enum_1.SubTask.TERMINAL) {
                    throw new common_1.BadRequestException(`Cannot create sub-task under terminal type task.`);
                }
                if (project.tasks[0].type === sub_task_enum_1.SubTask.LIST) {
                    const taskCountQuery = this.taskRepository.createQueryBuilder("task");
                    taskCountQuery.where("task.parentId = :parentId", { parentId });
                    const lastTaskQuery = this.taskRepository.createQueryBuilder("task");
                    lastTaskQuery
                        .leftJoinAndSelect("task.successors", "successors")
                        .where("task.parentId = :parentId", { parentId });
                    const children = await lastTaskQuery.getMany();
                    for (const child of children) {
                        if (child.successors.length === 0) {
                            last = child;
                            break;
                        }
                    }
                }
            }
        }
        else {
            if (project.type === sub_task_enum_1.SubTask.TERMINAL || project.type === sub_task_enum_1.SubTask.KANBAN) {
                throw new common_1.BadRequestException(`Cannot create task under terminal type project.`);
            }
        }
        const now = new Date();
        const newTask = new task_entity_1.Task();
        newTask.title = title;
        newTask.description = description;
        newTask.type = type;
        newTask.milestone = false;
        newTask.createdAt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
        newTask.start = start;
        newTask.deadline = deadline;
        newTask.isFinished = false;
        if (!isKanban && parentId) {
            newTask.parent = project.tasks[0];
            if (project.tasks[0].type === sub_task_enum_1.SubTask.LIST && last) {
                newTask.predecessors = [last];
            }
        }
        if (isKanban) {
            newTask.parentColumn = project.columns[0];
            if (last) {
                newTask.predecessors = [last];
            }
            if (project.columns[0].parent) {
                newTask.parent = project.columns[0].parent;
            }
        }
        newTask.project = project;
        await this.taskRepository.save(newTask);
        return {
            id: newTask.id,
            title,
            description,
            type,
        };
    }
    async updateTitle(user, taskId, newTitle) {
        const found = await this.taskRepository.getTaskforUpdate(user, taskId);
        found.title = newTitle;
        await this.taskRepository.save(found);
    }
    async updateDescription(user, taskId, newDescription) {
        const found = await this.taskRepository.getTaskforUpdate(user, taskId);
        found.description = newDescription;
        await this.taskRepository.save(found);
    }
    async updateStart(user, taskId, newStart) {
        const found = await this.taskRepository.getTaskforUpdate(user, taskId);
        found.start = newStart;
        await this.taskRepository.save(found);
    }
    async updateDeadline(user, taskId, newDeadline) {
        const found = await this.taskRepository.getTaskforUpdate(user, taskId);
        found.deadline = newDeadline;
        await this.taskRepository.save(found);
    }
    async updateMilestoneStatus(user, taskId, milestone) {
        const found = await this.taskRepository.getTaskforUpdate(user, taskId);
        found.milestone = milestone;
        await this.taskRepository.save(found);
        return { milestone };
    }
    async updateDescendantFinishedStatus(user, taskId, isFinished) {
        const taskQuery = this.taskRepository.createQueryBuilder("task");
        taskQuery
            .leftJoinAndSelect("task.members", "members", "members.id = :userId", { userId: user.id })
            .where("task.id = :taskId", { taskId });
        const found = await taskQuery.getOne();
        if (!found) {
            throw new common_1.NotFoundException(`The task with id ${taskId} is not found.`);
        }
        if (!found.members[0]) {
            throw new common_1.UnauthorizedException(`The user ${user.email} is not member of task ${taskId}`);
        }
        const descendants = await this.taskRepository.findDescendants(found);
        for (const descendant of descendants) {
            descendant.isFinished = isFinished;
            await this.taskRepository.save(descendant);
        }
        return { isFinished };
    }
    async updateFinishedStatus(user, taskId, isFinished) {
        const taskQuery = this.taskRepository.createQueryBuilder("task");
        taskQuery
            .leftJoinAndSelect("task.members", "members", "members.id = :userId", { userId: user.id })
            .where("task.id = :taskId", { taskId });
        const found = await taskQuery.getOne();
        if (!found) {
            throw new common_1.NotFoundException(`The task with id ${taskId} is not found.`);
        }
        if (!found.members[0]) {
            throw new common_1.UnauthorizedException(`The user ${user.email} is not member of task ${taskId}`);
        }
        await this.taskRepository.update({ id: taskId }, { isFinished });
        return { isFinished };
    }
    async createColumn(user, taskId, columnTitle) {
        return null;
    }
    async appendTaskBefore(user, appendTaskDto) {
        const { taskId, taskIdsToAppend } = appendTaskDto;
        const taskQuery = this.taskRepository.createQueryBuilder("task");
        taskQuery
            .select(["task.id"])
            .leftJoin("task.parent", "parent")
            .addSelect(["parent.id", "parent.type"])
            .leftJoin("task.project", "project")
            .addSelect(["project.id", "project.type"])
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .leftJoinAndSelect("task.predecessors", "predecessors")
            .where("task.id = :taskId", { taskId });
        const task = await taskQuery.getOne();
        if (!task) {
            throw new common_1.NotFoundException(`The task with id ${taskId} is not found.`);
        }
        if (!task.project.userToProjects[0]) {
            throw new common_1.UnauthorizedException(`User ${user.email} is not member of this project with id ${task.project.id}`);
        }
        if (task.project.userToProjects[0].right === user_right_enum_1.UserRight.COMPLETION_MOD ||
            task.project.userToProjects[0].right === user_right_enum_1.UserRight.MEMBER_MGT) {
            throw new common_1.UnauthorizedException(`User ${user.email} has insufficient permission to update tasks in this project with id ${task.project.id}. Your permission is ${task.project.userToProjects[0].right}.`);
        }
        const appendedTasks = [];
        const appendedTaskIds = [];
        const notFoundTaskIds = [];
        const differentParentTaskIds = [];
        const alreadyPredecessorIds = [];
        for (const taskIdToAppend of taskIdsToAppend) {
            const taskToAppendQuery = this.taskRepository.createQueryBuilder("task");
            taskToAppendQuery
                .select(["task.id"])
                .leftJoin("task.parent", "parent")
                .addSelect(["parent.id"])
                .leftJoin("task.project", "project")
                .addSelect(["project.id"])
                .leftJoinAndSelect("task.predecessors", "predecessors")
                .leftJoinAndSelect("task.successors", "successors")
                .where("task.id = :taskId", { taskId: taskIdToAppend });
            const taskToAppend = await taskToAppendQuery.getOne();
            if (!taskToAppend) {
                notFoundTaskIds.push(taskIdToAppend);
                continue;
            }
            if (task.parent && taskToAppend.parent) {
                if (task.parent.id !== taskToAppend.parent.id) {
                    differentParentTaskIds.push(taskIdToAppend);
                    continue;
                }
            }
            else if (!task.parent && !taskToAppend.parent) {
                if (task.project.id !== taskToAppend.project.id) {
                    differentParentTaskIds.push(taskIdToAppend);
                    continue;
                }
            }
            else {
                differentParentTaskIds.push(taskIdToAppend);
                continue;
            }
            for (const predecessor of task.predecessors) {
                if (predecessor.id === taskIdToAppend) {
                    alreadyPredecessorIds.push(taskIdToAppend);
                    continue;
                }
            }
            appendedTasks.push(taskToAppend);
            appendedTaskIds.push(taskIdToAppend);
        }
        if ((task.parent && task.parent.type === sub_task_enum_1.SubTask.GRAPH) ||
            (!task.parent && task.project.type === sub_task_enum_1.SubTask.GRAPH)) {
            for (const appendedTask of appendedTasks) {
                task.predecessors.push(appendedTask);
            }
        }
        else if (appendedTasks[0]) {
            const appendedTask = appendedTasks[0];
            appendedTask.predecessors = [];
            appendedTask.successors = [];
            await this.taskRepository.save(appendedTask);
            if (task.predecessors[0]) {
                task.predecessors[0].successors = [appendedTask];
                await this.taskRepository.save(task.predecessors[0]);
            }
            task.predecessors = [appendedTask];
        }
        await this.taskRepository.save(task);
        return { taskId, appendedTaskIds, notFoundTaskIds, differentParentTaskIds, alreadyPredecessorIds };
    }
    async appendTaskAfter(user, appendTaskDto) {
        const { taskId, taskIdsToAppend } = appendTaskDto;
        const taskQuery = this.taskRepository.createQueryBuilder("task");
        taskQuery
            .select(["task.id"])
            .leftJoin("task.parent", "parent")
            .addSelect(["parent.id", "parent.type"])
            .leftJoin("task.project", "project")
            .addSelect(["project.id", "project.type"])
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .leftJoinAndSelect("task.successors", "successors")
            .where("task.id = :taskId", { taskId });
        const task = await taskQuery.getOne();
        if (!task) {
            throw new common_1.NotFoundException(`The task with id ${taskId} is not found.`);
        }
        if (!task.project.userToProjects[0]) {
            throw new common_1.UnauthorizedException(`User ${user.email} is not member of this project with id ${task.project.id}`);
        }
        if (task.project.userToProjects[0].right === user_right_enum_1.UserRight.COMPLETION_MOD ||
            task.project.userToProjects[0].right === user_right_enum_1.UserRight.MEMBER_MGT) {
            throw new common_1.UnauthorizedException(`User ${user.email} has insufficient permission to update tasks in this project with id ${task.project.id}. Your permission is ${task.project.userToProjects[0].right}.`);
        }
        const appendedTasks = [];
        const appendedTaskIds = [];
        const notFoundTaskIds = [];
        const differentParentTaskIds = [];
        const alreadyPredecessorIds = [];
        for (const taskIdToAppend of taskIdsToAppend) {
            const taskToAppendQuery = this.taskRepository.createQueryBuilder("task");
            taskToAppendQuery
                .select(["task.id"])
                .leftJoin("task.parent", "parent")
                .addSelect(["parent.id"])
                .leftJoin("task.project", "project")
                .addSelect(["project.id"])
                .leftJoinAndSelect("task.predecessors", "predecessors")
                .leftJoinAndSelect("task.successors", "successors")
                .where("task.id = :taskId", { taskId: taskIdToAppend });
            const taskToAppend = await taskToAppendQuery.getOne();
            if (!taskToAppend) {
                notFoundTaskIds.push(taskIdToAppend);
                continue;
            }
            if (task.parent && taskToAppend.parent) {
                if (task.parent.id !== taskToAppend.parent.id) {
                    differentParentTaskIds.push(taskIdToAppend);
                    continue;
                }
            }
            else if (!task.parent && !taskToAppend.parent) {
                if (task.project.id !== taskToAppend.project.id) {
                    differentParentTaskIds.push(taskIdToAppend);
                    continue;
                }
            }
            else {
                differentParentTaskIds.push(taskIdToAppend);
                continue;
            }
            for (const successor of task.successors) {
                if (successor.id === taskIdToAppend) {
                    alreadyPredecessorIds.push(taskIdToAppend);
                    continue;
                }
            }
            appendedTasks.push(taskToAppend);
            appendedTaskIds.push(taskIdToAppend);
        }
        if ((task.parent && task.parent.type === sub_task_enum_1.SubTask.GRAPH) ||
            (!task.parent && task.project.type === sub_task_enum_1.SubTask.GRAPH)) {
            for (const appendedTask of appendedTasks) {
                task.successors.push(appendedTask);
            }
        }
        else if (appendedTasks[0]) {
            const appendedTask = appendedTasks[0];
            appendedTask.predecessors = [];
            appendedTask.successors = [];
            await this.taskRepository.save(appendedTask);
            if (task.successors[0]) {
                task.successors[0].predecessors = [appendedTask];
                await this.taskRepository.save(task.successors[0]);
            }
            task.successors = [appendedTask];
        }
        await this.taskRepository.save(task);
        return { taskId, appendedTaskIds, notFoundTaskIds, differentParentTaskIds, alreadyPredecessorIds };
    }
    async disconnect(user, appendTaskDto) {
        const { taskId, taskIdsToAppend } = appendTaskDto;
        const task = await this.taskRepository
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.predecessors", "predecessors")
            .where("task.id = :taskId", { taskId })
            .getOne();
        task.predecessors = task.predecessors.filter((predecessor) => predecessor.id !== taskIdsToAppend[0]);
        await this.taskRepository.save(task);
    }
    async bringDownTask(user, bringDownDto) {
        const { taskId, taskIdToParent } = bringDownDto;
        const taskQuery = this.taskRepository.createQueryBuilder("task");
        taskQuery
            .select(["task.id"])
            .leftJoin("task.parent", "parent")
            .addSelect(["parent.id"])
            .leftJoin("task.project", "project")
            .addSelect(["project.id"])
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .leftJoinAndSelect("task.successors", "successors")
            .leftJoinAndSelect("task.predecessors", "predecessors")
            .where("task.id = :taskId", { taskId });
        const task = await taskQuery.getOne();
        if (!task) {
            throw new common_1.NotFoundException(`The task with id ${taskId} is not found.`);
        }
        if (!task.project.userToProjects[0]) {
            throw new common_1.UnauthorizedException(`User ${user.email} is not member of this project with id ${task.project.id}`);
        }
        if (task.project.userToProjects[0].right === user_right_enum_1.UserRight.COMPLETION_MOD ||
            task.project.userToProjects[0].right === user_right_enum_1.UserRight.MEMBER_MGT) {
            throw new common_1.UnauthorizedException(`User ${user.email} has insufficient permission to bring down task in this project with id ${task.project.id}. Your permission is ${task.project.userToProjects[0].right}.`);
        }
        const taskToParentQuery = this.taskRepository.createQueryBuilder("task");
        taskToParentQuery
            .leftJoin("task.parent", "parent")
            .addSelect(["parent.id"])
            .leftJoin("task.project", "project")
            .addSelect(["project.id"])
            .leftJoinAndSelect("task.children", "children")
            .where("task.id = :taskId", { taskId: taskIdToParent });
        const taskToParent = await taskToParentQuery.getOne();
        if (!taskToParent) {
            throw new common_1.NotFoundException(`The task with id ${taskIdToParent} is not found.`);
        }
        if (task.parent && taskToParent.parent) {
            if (task.parent.id !== taskToParent.parent.id) {
                throw new common_1.BadRequestException(`Task ${taskId} and Task ${taskIdToParent} has a different parent.`);
            }
        }
        else if (!task.parent && !taskToParent.parent) {
            if (task.project.id !== taskToParent.project.id) {
                throw new common_1.BadRequestException(`Task ${taskId} and Task ${taskIdToParent} are included in a different project.`);
            }
        }
        else {
            throw new common_1.BadRequestException(`Task ${taskId} and Task ${taskIdToParent} has a different parent.`);
        }
        if (taskToParent.type === sub_task_enum_1.SubTask.TERMINAL) {
            throw new common_1.BadRequestException(`Task ${taskIdToParent} is terminal task.`);
        }
        else if (taskToParent.type === sub_task_enum_1.SubTask.GRAPH) {
            task.predecessors = [];
            task.successors = [];
            task.parent = taskToParent;
        }
        else if (taskToParent.type === sub_task_enum_1.SubTask.LIST) {
            const lastTaskQuery = this.taskRepository.createQueryBuilder("task");
            lastTaskQuery
                .leftJoin("task.successors", "successors")
                .where("task.parentId = :parentId", { parentId: taskIdToParent })
                .having("COUNT(successors) = :count", { count: 0 });
            const last = await lastTaskQuery.getOne();
            if (last) {
                task.predecessors = [last];
            }
            else {
                task.predecessors = [];
            }
            task.successors = [];
            task.parent = taskToParent;
        }
        else {
            const firstColumnQuery = this.kanbanColumnRepository.createQueryBuilder("column");
            firstColumnQuery
                .leftJoin("column.predecessor", "predecessor")
                .leftJoinAndSelect("column.children", "children")
                .leftJoinAndSelect("children.successors", "successors")
                .where("column.parentId = :parentId", { parentId: taskIdToParent })
                .andWhere("predecessor IS NULL");
            const firstColumn = await firstColumnQuery.getOne();
            let last = null;
            for (const columnTask of firstColumn.children) {
                if (columnTask.successors.length === 0) {
                    last = columnTask;
                }
            }
            if (last) {
                task.predecessors = [last];
            }
            else {
                task.predecessors = [];
            }
            task.successors = [];
            task.parent = taskToParent;
            if (firstColumn) {
                task.parentColumn = firstColumn;
            }
            else {
                const createdColumn = await this.createColumn(user, taskToParent.id, "Untitled");
                task.parentColumn = createdColumn;
            }
        }
        await this.taskRepository.save(task);
    }
    async bringUpTask(user, taskId) {
        const taskQuery = this.taskRepository.createQueryBuilder("task");
        taskQuery
            .leftJoinAndSelect("task.parent", "parent")
            .leftJoinAndSelect("parent.parent", "grandparent")
            .leftJoinAndSelect("task.project", "project")
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .leftJoinAndSelect("task.successors", "successors")
            .leftJoinAndSelect("task.predecessors", "predecessors")
            .where("task.id = :taskId", { taskId });
        const task = await taskQuery.getOne();
        if (!task) {
            throw new common_1.NotFoundException(`The task with id ${taskId} is not found.`);
        }
        if (!task.project.userToProjects[0]) {
            throw new common_1.UnauthorizedException(`User ${user.email} is not member of this project with id ${task.project.id}`);
        }
        if (task.project.userToProjects[0].right === user_right_enum_1.UserRight.COMPLETION_MOD ||
            task.project.userToProjects[0].right === user_right_enum_1.UserRight.MEMBER_MGT) {
            throw new common_1.UnauthorizedException(`User ${user.email} has insufficient permission to bring up task in this project with id ${task.project.id}. Your permission is ${task.project.userToProjects[0].right}.`);
        }
        if (!task.parent) {
            throw new common_1.BadRequestException(`Task ${taskId} is a root task of the project ${task.project.id}`);
        }
        let type = sub_task_enum_1.SubTask.TERMINAL;
        if (!task.parent.parent) {
            task.parent = null;
            type = task.project.type;
        }
        else {
            task.parent = task.parent.parent;
            type = task.parent.parent.type;
        }
        if (type === sub_task_enum_1.SubTask.GRAPH) {
            task.predecessors = [];
            task.successors = [];
            task.parentColumn = null;
        }
        else if (type === sub_task_enum_1.SubTask.LIST) {
            const lastTaskQuery = this.taskRepository.createQueryBuilder("task");
            lastTaskQuery.leftJoin("task.successors", "successors").having("COUNT(successors) = :count", { count: 0 });
            if (!task.parent.parent) {
                lastTaskQuery
                    .where("task.parent IS NULL")
                    .andWhere("task.projectId = :projectId", { projectId: task.project.id });
            }
            else {
                lastTaskQuery.where("task.parentId = :parentId", { parentId: task.parent.parent.id });
            }
            const last = await lastTaskQuery.getOne();
            if (last) {
                task.predecessors = [last];
            }
            else {
                task.predecessors = [];
            }
            task.successors = [];
            task.parentColumn = null;
        }
        else if (type === sub_task_enum_1.SubTask.KANBAN) {
            const firstColumnQuery = this.kanbanColumnRepository.createQueryBuilder("column");
            firstColumnQuery
                .leftJoin("column.predecessor", "predecessor")
                .leftJoinAndSelect("column.children", "children")
                .leftJoinAndSelect("children.successors", "successors")
                .where("predecessor IS NULL");
            if (!task.parent.parent) {
                firstColumnQuery
                    .andWhere("column.parent IS NULL")
                    .andWhere("column.projectId = :projectId", { projectId: task.project.id });
            }
            else {
                firstColumnQuery.andWhere("column.parentId = :parentId", { parentId: task.parent.parent.id });
            }
            const firstColumn = await firstColumnQuery.getOne();
            let last = null;
            for (const columnTask of firstColumn.children) {
                if (columnTask.successors.length === 0) {
                    last = columnTask;
                }
            }
            if (last) {
                task.predecessors = [last];
            }
            else {
                task.predecessors = [];
            }
            task.successors = [];
            task.parentColumn = firstColumn;
        }
        else {
            throw new common_1.BadRequestException(`The parent of parent task ${task.parent.parent.id} cannot be terminal task.`);
        }
        await this.taskRepository.save(task);
    }
    async invite(user, taskId, memberIds) {
        const taskQuery = this.taskRepository.createQueryBuilder("task");
        taskQuery
            .select(["task.id"])
            .leftJoin("task.project", "project")
            .addSelect(["project.id"])
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .where("task.id = :taskId", { taskId });
        const task = await taskQuery.getOne();
        if (!task) {
            throw new common_1.NotFoundException(`The task with id ${taskId} is not found.`);
        }
        if (!task.project.userToProjects[0]) {
            throw new common_1.UnauthorizedException(`User ${user.email} is not member of this project with id ${task.project.id}`);
        }
        if (task.project.userToProjects[0].right === user_right_enum_1.UserRight.COMPLETION_MOD ||
            task.project.userToProjects[0].right === user_right_enum_1.UserRight.TASK_MGT) {
            throw new common_1.UnauthorizedException(`User ${user.email} has insufficient permission to invite members to task ${taskId} in this project with id ${task.project.id}. Your permission is ${task.project.userToProjects[0].right}.`);
        }
        const addedMemberIds = [];
        const notFoundUserIds = [];
        const notProjectMemberIds = [];
        const alreadyTaskMemberIds = [];
        for (const memberId of memberIds) {
            const userQuery = this.userRepository.createQueryBuilder("user");
            userQuery
                .leftJoinAndSelect("user.userToProjects", "userToProjects", "userToProjects.projectId = :projectId", {
                projectId: task.project.id,
            })
                .leftJoinAndSelect("user.tasks", "tasks", "tasks.id = :taskId", { taskId })
                .where("user.id = :memberId", { memberId });
            const foundUser = await userQuery.getOne();
            if (!foundUser) {
                notFoundUserIds.push(memberId);
                continue;
            }
            if (!foundUser.userToProjects[0]) {
                notProjectMemberIds.push(memberId);
                continue;
            }
            if (foundUser.tasks[0]) {
                alreadyTaskMemberIds.push(memberId);
                continue;
            }
            const ancestorsQuery = this.taskRepository.createAncestorsQueryBuilder("task", "taskClosure", task);
            ancestorsQuery.leftJoinAndSelect("task.members", "members");
            const ancestors = await ancestorsQuery.getMany();
            for (const ancestor of ancestors) {
                for (const member of ancestor.members) {
                    if (member.id === memberId) {
                        continue;
                    }
                }
                ancestor.members.push(foundUser);
                await this.taskRepository.save(ancestor);
            }
            addedMemberIds.push(memberId);
        }
        return { memberIds, addedMemberIds, notFoundUserIds, notProjectMemberIds, alreadyTaskMemberIds };
    }
    async dismiss(user, taskId, memberIds) {
        const taskQuery = this.taskRepository.createQueryBuilder("task");
        taskQuery
            .select(["task.id"])
            .leftJoin("task.project", "project")
            .addSelect(["project.id"])
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .where("task.id = :taskId", { taskId });
        const task = await taskQuery.getOne();
        if (!task) {
            throw new common_1.NotFoundException(`The task with id ${taskId} is not found.`);
        }
        if (!task.project.userToProjects[0]) {
            throw new common_1.UnauthorizedException(`User ${user.email} is not member of this project with id ${task.project.id}`);
        }
        if (task.project.userToProjects[0].right === user_right_enum_1.UserRight.COMPLETION_MOD ||
            task.project.userToProjects[0].right === user_right_enum_1.UserRight.TASK_MGT) {
            throw new common_1.UnauthorizedException(`User ${user.email} has insufficient permission to invite members to task ${taskId} in this project with id ${task.project.id}. Your permission is ${task.project.userToProjects[0].right}.`);
        }
        const deletedMemberIds = [];
        const notFoundUserIds = [];
        const alreadyNotTaskMemberIds = [];
        for (const memberId of memberIds) {
            const userQuery = this.userRepository.createQueryBuilder("user");
            userQuery
                .leftJoinAndSelect("user.tasks", "tasks", "tasks.id = :taskId", { taskId })
                .where("user.id = :memberId", { memberId });
            const foundUser = await userQuery.getOne();
            if (!foundUser) {
                notFoundUserIds.push(memberId);
                continue;
            }
            if (!foundUser.tasks[0]) {
                alreadyNotTaskMemberIds.push(memberId);
                continue;
            }
            const descendants = await this.taskRepository.findDescendants(task, { relations: ["members"] });
            for (const descendant of descendants) {
                descendant.members = descendant.members.filter((member) => member.id !== memberId);
                await this.taskRepository.save(descendant);
            }
            deletedMemberIds.push(memberId);
        }
        return { memberIds, deletedMemberIds, notFoundUserIds, alreadyNotTaskMemberIds };
    }
    async getAllContents(user, taskId) {
        const contents = await this.taskContentRepository.findBy({ taskId });
        return contents;
    }
    async createContent(user, taskId) {
        const content = new task_content_entity_1.TaskContent();
        content.title = "New Document";
        const now = new Date();
        content.createdAt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
        content.modifiedAt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
        content.content = "";
        content.task = await this.taskRepository.findOneBy({ id: taskId });
        await this.taskContentRepository.save(content);
    }
    async getAllBookmarks(user, projectId) {
        const roots = await this.bookmarkRepository.find({
            where: { userId: user.id, parent: (0, typeorm_2.IsNull)(), projectId },
        });
        for (let i = 0; i < roots.length; ++i) {
            roots[i] = await this.bookmarkRepository.findDescendantsTree(roots[i]);
        }
        return roots;
    }
    async updateBookmarkTitle(user, bookmarkId, newTitle) {
        await this.bookmarkRepository.update({ id: bookmarkId }, { title: newTitle });
    }
    async createBookmark(user, createBookmarkDto) {
        const { title, projectId, taskId, parentId } = createBookmarkDto;
        const projectQuery = this.projectRepository.createQueryBuilder("project");
        projectQuery.leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        });
        if (taskId) {
            projectQuery.leftJoinAndSelect("project.tasks", "tasks", "tasks.id = :taskId", {
                taskId,
            });
        }
        if (parentId) {
            projectQuery.leftJoinAndSelect("project.bookmarks", "bookmarks", "(bookmarks.id = :bookmarkId) AND (bookmarks.taskId IS NULL)", {
                bookmarkId: parentId,
            });
        }
        projectQuery.where("project.id = :projectId", { projectId });
        const project = await projectQuery.getOne();
        if (!project) {
            throw new common_1.NotFoundException(`Project ${projectId} is not found.`);
        }
        if (project.userToProjects.length <= 0) {
            throw new common_1.UnauthorizedException(`User ${user.email} is not member of the project ${projectId}`);
        }
        if (taskId && project.tasks.length <= 0) {
            throw new common_1.NotFoundException(`Task ${taskId} is not found.`);
        }
        if (parentId && project.bookmarks.length <= 0) {
            throw new common_1.NotFoundException(`Bookmark folder ${parentId} is not found.`);
        }
        const newBookmark = new bookmark_entity_1.Bookmark();
        newBookmark.title = title;
        newBookmark.user = user;
        newBookmark.project = project;
        if (taskId) {
            newBookmark.task = project.tasks[0];
        }
        if (parentId) {
            newBookmark.parent = project.bookmarks[0];
        }
        await this.bookmarkRepository.save(newBookmark);
    }
    async deleteBookmark(user, bookmarkId, cascading) {
        const target = await this.bookmarkRepository.findOne({
            where: { id: bookmarkId },
            relations: { children: true, parent: true },
        });
        if (!cascading) {
            for (const child of target.children) {
                child.parent = target.parent;
                await this.bookmarkRepository.save(child);
            }
        }
        await this.bookmarkRepository.findDescendants(target);
        await this.bookmarkRepository.delete({ id: bookmarkId });
    }
    async deleteBookmarkByTaskID(user, projectId, taskId) {
        await this.bookmarkRepository.delete({ taskId, projectId, userId: user.id });
    }
    async deleteTask(user, taskId, cascading) {
        const taskQuery = this.taskRepository.createQueryBuilder("task");
        taskQuery
            .leftJoinAndSelect("task.project", "project")
            .leftJoinAndSelect("task.children", "children")
            .leftJoinAndSelect("task.predecessors", "predecessors")
            .leftJoinAndSelect("task.successors", "successors")
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .where("task.id = :taskId", { taskId });
        const task = await taskQuery.getOne();
        if (!task) {
            throw new common_1.NotFoundException(`The task with id ${taskId} is not found.`);
        }
        if (!task.project.userToProjects[0]) {
            throw new common_1.UnauthorizedException(`User ${user.email} is not member of this project with id ${task.project.id}`);
        }
        if (task.project.userToProjects[0].right === user_right_enum_1.UserRight.COMPLETION_MOD ||
            task.project.userToProjects[0].right === user_right_enum_1.UserRight.MEMBER_MGT) {
            throw new common_1.UnauthorizedException(`User ${user.email} has insufficient permission to delete task ${taskId} in this project with id ${task.project.id}. Your permission is ${task.project.userToProjects[0].right}.`);
        }
        if (!cascading) {
            for (const child of task.children) {
                this.bringUpTask(user, child.id);
            }
        }
        task.predecessors = [];
        task.successors = [];
        await this.taskRepository.save(task);
        await this.taskRepository.findDescendants(task);
        await this.taskRepository.delete({ id: taskId });
    }
};
TaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_repository_1.TaskRepository)),
    __param(1, (0, typeorm_1.InjectRepository)(project_repository_1.ProjectRepository)),
    __param(2, (0, typeorm_1.InjectRepository)(user_repository_1.UserRepository)),
    __param(3, (0, typeorm_1.InjectRepository)(bookmark_repository_1.BookmarkRepository)),
    __param(4, (0, typeorm_1.InjectRepository)(kanban_column_repository_1.KanbanColumnRepository)),
    __param(5, (0, typeorm_1.InjectRepository)(task_content_repository_1.TaskContentRepository)),
    __metadata("design:paramtypes", [task_repository_1.TaskRepository,
        project_repository_1.ProjectRepository,
        user_repository_1.UserRepository,
        bookmark_repository_1.BookmarkRepository,
        kanban_column_repository_1.KanbanColumnRepository,
        task_content_repository_1.TaskContentRepository])
], TaskService);
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map