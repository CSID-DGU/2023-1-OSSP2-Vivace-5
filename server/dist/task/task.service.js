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
const content_repository_1 = require("./content.repository");
const task_content_entity_1 = require("../entity/task-content.entity");
const userToTask_repository_1 = require("./userToTask.repository");
const user_to_task_entity_1 = require("../entity/user-to-task.entity");
let TaskService = class TaskService {
    constructor(taskRepository, projectRepository, userRepository, contentRepository, userToTaskRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.contentRepository = contentRepository;
        this.userToTaskRepository = userToTaskRepository;
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
            .leftJoinAndSelect("children.predecessors", "predecessors")
            .leftJoinAndSelect("children.successors", "successors")
            .leftJoin("task.members", "members")
            .leftJoinAndSelect("task.contents", "contents")
            .leftJoinAndSelect("task.comments", "comments")
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .leftJoinAndSelect("task.bookmarks", "bookmarks", "bookmarks.userId = :userId", { userId: user.id })
            .where("task.id = :taskId", { taskId });
        const found = await taskQuery.getOne();
        if (!found) {
            throw new common_1.NotFoundException(`The task with id ${taskId} is not found.`);
        }
        if (!found.project.userToProjects[0]) {
            throw new common_1.UnauthorizedException(`The user ${user.email} is not member of this project with id ${found.project.id}`);
        }
        return found;
    }
    async createTask(user, createTaskDto) {
        const { projectId, parentId, isKanban, title, description, type, start, deadline } = createTaskDto;
        if (isKanban && !parentId) {
            throw new common_1.BadRequestException(`If the parent task is a Kanban board, the column id must be specified.`);
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
                    .where("task.parentColumnId = :parentId", { parentId })
                    .andWhere("task.successors IS NULL");
                last = await columnTaskQuery.getOne();
            }
            else {
                if (!project.tasks[0]) {
                    throw new common_1.NotFoundException(`The parent task with id ${parentId} is not found in this project with id ${projectId}.`);
                }
                if (project.tasks[0].type === sub_task_enum_1.SubTask.KANBAN) {
                    throw new common_1.BadRequestException(`The parent task with id ${parentId} cannot be the type of kanban board.`);
                }
                if (project.type === sub_task_enum_1.SubTask.TERMINAL) {
                    throw new common_1.BadRequestException(`Cannot create sub-task under terminal type task.`);
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
        found.isFinished = isFinished;
        await this.taskRepository.save(found);
        return { isFinished };
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
            .select(["task.id"])
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
        task.predecessors = [];
        task.successors = [];
        task.parent = taskToParent;
        await this.taskRepository.save(task);
    }
    async bringUpTask(user, taskId) {
        const taskQuery = this.taskRepository.createQueryBuilder("task");
        taskQuery
            .select(["task.id"])
            .leftJoinAndSelect("task.parent", "parent")
            .leftJoinAndSelect("parent.parent", "grandparent")
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
            throw new common_1.UnauthorizedException(`User ${user.email} has insufficient permission to bring up task in this project with id ${task.project.id}. Your permission is ${task.project.userToProjects[0].right}.`);
        }
        if (!task.parent) {
            throw new common_1.BadRequestException(`Task ${taskId} is a root task of the project ${task.project.id}`);
        }
        task.predecessors = [];
        task.successors = [];
        task.parentColumn = null;
        if (!task.parent.parent) {
            task.parent = null;
        }
        else {
            task.parent = task.parent.parent;
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
            foundUser.tasks.push(task);
            await this.userRepository.save(foundUser);
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
            foundUser.tasks = foundUser.tasks.filter((task) => {
                task.id !== taskId;
            });
            await this.userRepository.save(foundUser);
            deletedMemberIds.push(memberId);
        }
        return { memberIds, deletedMemberIds, notFoundUserIds, alreadyNotTaskMemberIds };
    }
    async deleteTask(user, deleteTaskDto) {
        const { taskId, cascading } = deleteTaskDto;
        const taskQuery = this.taskRepository.createQueryBuilder("task");
        taskQuery
            .select(["task.id"])
            .leftJoin("task.project", "project")
            .addSelect(["project.id"])
            .leftJoinAndSelect("task.children", "children")
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
        await this.taskRepository.findDescendants(task);
        await this.taskRepository.delete({ id: taskId });
    }
    async createContent(user, taskId, createContentDto) {
        const { title, content } = createContentDto;
        if (!taskId || !title) {
            throw new common_1.BadRequestException("Task id and title are required.");
        }
        const taskQuery = this.taskRepository.createQueryBuilder("task");
        taskQuery.where("task.id = :taskId", { taskId });
        const task = await taskQuery.getOne();
        if (!task) {
            throw new common_1.NotFoundException(`The task with id ${taskId} is not found.`);
        }
        const now = new Date();
        const newContent = new task_content_entity_1.TaskContent();
        newContent.title = title;
        newContent.content = content;
        newContent.task = task;
        newContent.createdAt = now;
        newContent.modifiedAt = now;
        await this.contentRepository.save(newContent);
        return {
            id: newContent.id,
            title: newContent.title,
            content: newContent.content,
            taskId: newContent.task.id,
        };
    }
    async getAllContents(user, taskId) {
        const contentQuery = this.contentRepository.createQueryBuilder("content");
        contentQuery
            .select(["content.id", "content.title", "content.content"])
            .leftJoin("content.task", "task")
            .addSelect(["task.id"])
            .where("task.id = :taskId", { taskId });
        const contents = await contentQuery.getMany();
        return contents;
    }
    async updateContent(user, contentId, updateContentDto) {
        const { title, content } = updateContentDto;
        const contentQuery = this.contentRepository.createQueryBuilder("content");
        contentQuery.where("content.id = :contentId", { contentId });
        const taskContent = await contentQuery.getOne();
        if (!taskContent) {
            throw new common_1.NotFoundException(`The task with id ${contentId} is not found.`);
        }
        if (title) {
            taskContent.title = title;
        }
        if (content) {
            taskContent.content = content;
        }
        await this.contentRepository.save(taskContent);
        return {
            id: taskContent.id,
            title: taskContent.title,
            content: taskContent.content,
            contentId: taskContent.id,
        };
    }
    async deleteContent(user, contentId) {
        const contentQuery = this.contentRepository.createQueryBuilder("content");
        contentQuery
            .select(["content.id"])
            .leftJoin("content.task", "task")
            .addSelect(["task.id"])
            .where("content.id = :contentId", { contentId });
        const foundContent = await contentQuery.getOne();
        if (!foundContent) {
            throw new common_1.NotFoundException(`The content with id ${contentId} is not found.`);
        }
        await this.contentRepository.delete({ id: contentId });
    }
    async createBookmark(user, taskId) {
        const taskQuery = this.taskRepository.createQueryBuilder("task");
        taskQuery.where("task.id = :taskId", { taskId });
        const task = await taskQuery.getOne();
        if (!task) {
            throw new common_1.NotFoundException(`The task with id ${taskId} is not found.`);
        }
        const userToTask = new user_to_task_entity_1.UserToTask();
        userToTask.user = user;
        userToTask.task = task;
        userToTask.bookmark = true;
        await this.userToTaskRepository.save(userToTask);
        return {
            id: userToTask.id,
            taskId: userToTask.task.id,
        };
    }
    async deleteBookmark(user, taskId) {
        const options = {
            where: { userId: user.id, taskId },
        };
        const userToTask = await this.userToTaskRepository.findOne(options);
        if (!userToTask) {
            throw new common_1.NotFoundException(`The userToTask with userId ${user.id} and taskId ${taskId} is not found.`);
        }
        userToTask.bookmark = false;
        await this.userToTaskRepository.save(userToTask);
    }
    async getAllBookmarks(user) {
        const options = {
            where: { userId: user.id, bookmark: true },
        };
        const userToTasks = await this.userToTaskRepository.find(options);
        const tasks = userToTasks.map((userToTask) => userToTask.task);
        return tasks;
    }
};
TaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_repository_1.TaskRepository)),
    __param(1, (0, typeorm_1.InjectRepository)(project_repository_1.ProjectRepository)),
    __param(2, (0, typeorm_1.InjectRepository)(user_repository_1.UserRepository)),
    __param(3, (0, typeorm_1.InjectRepository)(content_repository_1.TaskContentRepository)),
    __param(4, (0, typeorm_1.InjectRepository)(userToTask_repository_1.UserToTaskRepository)),
    __metadata("design:paramtypes", [task_repository_1.TaskRepository,
        project_repository_1.ProjectRepository,
        user_repository_1.UserRepository,
        content_repository_1.TaskContentRepository,
        userToTask_repository_1.UserToTaskRepository])
], TaskService);
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map