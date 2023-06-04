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
exports.TaskController = void 0;
const common_1 = require("@nestjs/common");
const task_service_1 = require("./task.service");
const passport_1 = require("@nestjs/passport");
const get_user_decorator_1 = require("../decorator/get-user.decorator");
const user_entity_1 = require("../entity/user.entity");
const create_task_dto_1 = require("./dto/create-task.dto");
const append_task_dto_1 = require("./dto/append-task.dto");
const bring_down_task_dto_1 = require("./dto/bring-down-task.dto");
const not_empty_string_validation_pipe_1 = require("../pipe/not-empty-string-validation.pipe");
const time_format_validation_pipe_1 = require("../pipe/time-format.validation.pipe");
const append_column_dto_1 = require("./dto/append-column.dto");
const move_task_between_columns_dto_1 = require("./dto/move-task-between-columns.dto");
const create_bookmark_dto_1 = require("./dto/create-bookmark.dto");
const bring_down_bookmark_dto_1 = require("./dto/bring-down-bookmark.dto");
const sub_task_enum_1 = require("../enum/sub-task.enum");
const boolean_pipe_1 = require("../pipe/boolean.pipe");
const delete_task_dto_1 = require("./dto/delete-task.dto");
const swagger_1 = require("@nestjs/swagger");
const user_right_enum_1 = require("../enum/user-right.enum");
let TaskController = class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
        this.logger = new common_1.Logger("TaskController");
    }
    getTaskInfo(user, taskId) {
        this.logger.verbose(`User ${user.email} trying to get the task information with id ${taskId}`);
        return this.taskService.getTaskInfo(user, taskId);
    }
    createTask(user, createTaskDto) {
        this.logger.verbose(`User ${user.email} trying to create a task`);
        return this.taskService.createTask(user, createTaskDto);
    }
    updateTitle(user, taskId, newTitle) {
        this.logger.verbose(`User ${user.email} trying to update the title of task with id ${taskId} into new title ${newTitle}`);
        return this.taskService.updateTitle(user, taskId, newTitle);
    }
    updateDescription(user, taskId, newDescription) {
        this.logger.verbose(`User ${user.email} trying to update the description of task with id ${taskId}`);
        return this.taskService.updateDescription(user, taskId, newDescription);
    }
    updateStart(user, taskId, newStart) {
        this.logger.verbose(`User ${user.email} trying to update the start date of task with id ${taskId}`);
        return this.taskService.updateStart(user, taskId, newStart);
    }
    updateDeadline(user, taskId, newDeadline) {
        this.logger.verbose(`User ${user.email} trying to update the deadline of task with id ${taskId}`);
        return this.taskService.updateDeadline(user, taskId, newDeadline);
    }
    updateMilestoneStatus(user, taskId, milestone) {
        this.logger.verbose(`User ${user.email} trying to update whether task with id ${taskId} is milestone or not`);
        return this.taskService.updateMilestoneStatus(user, taskId, milestone);
    }
    updateFinishedStatus(user, taskId, isFinished) {
        this.logger.verbose(`User ${user.email} trying to update whether task with id ${taskId} is finished`);
        return this.taskService.updateFinishedStatus(user, taskId, isFinished);
    }
    createColumn(user, taskId, columnTitle) { }
    createColumnInRoot(user, projectId, columnTitle) { }
    updateColumnTitle(user, columnId, newTitle) { }
    appendColumnBefore(user, appendColumnDto) { }
    appendColumnAfter(user, appendColumnDto) { }
    moveTaskBetweenColumns(user, moveTaskBetweenColumnsDto) { }
    deleteColumn(user, columnId) { }
    appendTaskBefore(user, appendTaskDto) {
        this.logger.verbose(`User ${user.email} trying to append some tasks before task ${appendTaskDto.taskId}`);
        return this.taskService.appendTaskBefore(user, appendTaskDto);
    }
    appendTaskAfter(user, appendTaskDto) {
        this.logger.verbose(`User ${user.email} trying to append some tasks after task ${appendTaskDto.taskId}`);
        return this.taskService.appendTaskAfter(user, appendTaskDto);
    }
    bringDownTask(user, bringDownDto) {
        this.logger.verbose(`User ${user.email} trying to bring down task ${bringDownDto.taskId} under the task ${bringDownDto.taskIdToParent}`);
        return this.taskService.bringDownTask(user, bringDownDto);
    }
    bringUpTask(user, taskId) {
        this.logger.verbose(`User ${user.email} trying to bring up task ${taskId}`);
        return this.taskService.bringUpTask(user, taskId);
    }
    invite(user, taskId, memberIds) {
        this.logger.verbose(`User ${user.email} trying to invite members to task with id ${taskId}`);
        return this.taskService.invite(user, taskId, memberIds);
    }
    dismiss(user, taskId, memberIds) {
        this.logger.verbose(`User ${user.email} trying to dismiss members from task with id ${taskId}`);
        return this.taskService.dismiss(user, taskId, memberIds);
    }
    getAllBookmarks(user, query) { }
    getAllBookmarkFolders(user) { }
    createBookmark(user, createBookmarkDto) { }
    bringDownBookmark(user, bringDownBookmarkDto) { }
    bringUpBookmark(user, bookmarkId) { }
    updateBookmarkTitle(user, bookmarkId, newTitle) { }
    deleteBookmark(user, bookmarkId) { }
    getAllContents(user, taskId) { }
    createContent(user, taskId) { }
    updateContent(user, contentId, content) { }
    deleteContent(user, contentId) { }
    getAllComments(user, taskId, query) { }
    createCommment(user, taskId, content) { }
    createReply(user, commentId, content) { }
    updateCommentContent(user, commentId, content) { }
    updateCommentPinStatus(user, commentId, pinned) { }
    deleteComment(user, commentId) { }
    deleteTask(user, deleteTaskDto) {
        this.logger.verbose(`User ${user.email} trying to delete the task with id ${deleteTaskDto.taskId}`);
        return this.taskService.deleteTask(user, deleteTaskDto);
    }
};
__decorate([
    (0, common_1.Get)("/:id"),
    (0, swagger_1.ApiOperation)({
        summary: "Get task info",
        description: "Get the information of task specified by the task ID.",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Return the task object",
        schema: {
            type: "object",
            properties: {
                id: { type: "string", example: "1268c369-9f46-44f4-b3f9-0c0f14f25cd9" },
                title: { type: "string", example: "My first task" },
                description: { type: "string", example: "It will be a great work" },
                type: {
                    type: "enum",
                    enum: [sub_task_enum_1.SubTask.GRAPH, sub_task_enum_1.SubTask.KANBAN, sub_task_enum_1.SubTask.LIST, sub_task_enum_1.SubTask.TERMINAL],
                    example: sub_task_enum_1.SubTask.LIST,
                },
                milestone: { type: "boolean", example: true },
                createdAt: { type: "string", example: "2023-05-18T16:27:50.000Z" },
                start: { type: "string", example: "2023-05-20T12:49:55.000Z" },
                end: { type: "string", example: null },
                deadline: { type: "string", example: "2023-05-23T16:27:50.000Z" },
                isFinished: { type: "boolean", example: false },
                parentColumnId: { type: "string", example: null },
                projectId: { type: "string", example: "3148412e-1a62-46dc-97b2-b84a27eaffe8" },
                project: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "3148412e-1a62-46dc-97b2-b84a27eaffe8" },
                        title: { type: "string", example: "1st Project" },
                        description: { type: "string", example: "My incredible first project." },
                        type: {
                            type: "enum",
                            enum: [sub_task_enum_1.SubTask.GRAPH, sub_task_enum_1.SubTask.KANBAN, sub_task_enum_1.SubTask.LIST],
                            example: sub_task_enum_1.SubTask.GRAPH,
                        },
                        encodedImg: {
                            type: "string",
                            example: "data:image/jpeg;base64,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",
                        },
                        createdAt: { type: "string", example: "2023-05-16T14:07:10.000Z" },
                        userToProjects: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string", example: "53803444-3d9f-41ef-bb15-8203cbf2bfef" },
                                    right: {
                                        type: "enum",
                                        enum: [
                                            user_right_enum_1.UserRight.ADMIN,
                                            user_right_enum_1.UserRight.COMPLETION_MOD,
                                            user_right_enum_1.UserRight.MEMBER_AND_TASK_MGT,
                                            user_right_enum_1.UserRight.MEMBER_MGT,
                                            user_right_enum_1.UserRight.TASK_MGT,
                                        ],
                                        example: user_right_enum_1.UserRight.ADMIN,
                                    },
                                    projectId: { type: "string", example: "3148412e-1a62-46dc-97b2-b84a27eaffe8" },
                                    userId: { type: "string", example: "bf536e46-90d3-44b8-9bf9-c17bf1a8fe42" },
                                },
                            },
                        },
                    },
                },
                childColumns: { type: "array" },
                parentColumn: { type: "object", example: null },
                parent: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "4014c3d5-5d3d-4de2-8bbd-9caa52dc7fa0" },
                        title: { type: "string", example: "Parent" },
                        description: { type: "string", example: ":)" },
                        type: {
                            type: "enum",
                            enum: [sub_task_enum_1.SubTask.GRAPH, sub_task_enum_1.SubTask.KANBAN, sub_task_enum_1.SubTask.LIST],
                            example: sub_task_enum_1.SubTask.LIST,
                        },
                        milestone: { type: "boolean", example: false },
                        createdAt: { type: "string", example: "2023-05-17T12:46:27.000Z" },
                        start: { type: "string", example: "2023-05-21T07:05:06.000Z" },
                        end: { type: "string", example: null },
                        deadline: { type: "string", example: "2023-05-21T07:17:29.000Z" },
                        isFinished: { type: "boolean", example: true },
                        parentColumnId: { type: "string", example: null },
                        projectId: { type: "string", example: "3148412e-1a62-46dc-97b2-b84a27eaffe8" },
                    },
                },
                children: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", example: "bc25ebc8-23b3-4df0-a853-f1c291bc6e92" },
                            title: { type: "string", example: "Nested Nested Task2" },
                            description: { type: "string", example: "hihihihihihi" },
                            type: {
                                type: "enum",
                                enum: [sub_task_enum_1.SubTask.GRAPH, sub_task_enum_1.SubTask.KANBAN, sub_task_enum_1.SubTask.LIST, sub_task_enum_1.SubTask.TERMINAL],
                                example: sub_task_enum_1.SubTask.TERMINAL,
                            },
                            milestone: { type: "boolean", example: false },
                            createdAt: { type: "string", example: "2023-05-20T13:01:15.000Z" },
                            start: { type: "string", example: "2023-05-18T16:27:50.000Z" },
                            end: { type: "string", example: null },
                            deadline: { type: "string", example: "2023-05-23T16:27:50.000Z" },
                            isFinished: { type: "boolean", example: false },
                            parentColumnId: { type: "string", example: null },
                            projectId: { type: "string", example: "3148412e-1a62-46dc-97b2-b84a27eaffe8" },
                            predecessors: { type: "array" },
                            successors: { type: "array" },
                        },
                    },
                },
                members: { type: "array" },
                contents: { type: "array" },
                comments: { type: "array" },
                bookmarks: { type: "array" },
            },
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "If there is no task for the received ID, return the Not Found error.",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "If the user who sent the request is not a member of this project including task, the user is not eligible to view the task information. So, returns an unauthorized error.",
    }),
    (0, swagger_1.ApiParam)({ name: "id", type: "string", description: "Task UUID" }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getTaskInfo", null);
__decorate([
    (0, common_1.Post)("/create"),
    (0, swagger_1.ApiOperation)({
        summary: "Create a new task",
        description: "Create a new task",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Return a object to contain id, title, description, type of the created task.",
        schema: {
            type: "object",
            properties: {
                id: { type: "string", example: "1268c369-9f46-44f4-b3f9-0c0f14f25cd9" },
                title: { type: "string", example: "Nested task" },
                description: { type: "string", example: "haha" },
                type: {
                    type: "enum",
                    enum: [sub_task_enum_1.SubTask.GRAPH, sub_task_enum_1.SubTask.KANBAN, sub_task_enum_1.SubTask.LIST, sub_task_enum_1.SubTask.TERMINAL],
                    example: sub_task_enum_1.SubTask.TERMINAL,
                },
            },
        },
    }),
    (0, swagger_1.ApiNotAcceptableResponse)({
        description: "If column Id is not designated as parentId even though it is a Kanban board, or if the parent's work is Kanban board when it is not designated as a Kanban board, or if the parent's work is terminal work.",
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "If the project does not exist, or if the parent work or parent column does not exist",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "If the user is not member of the project that you want to create work for, or if the user don't have sufficient privileges",
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        create_task_dto_1.CreateTaskDto]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "createTask", null);
__decorate([
    (0, common_1.Patch)("/update/title/:id"),
    (0, swagger_1.ApiOperation)({
        summary: "Update the task title",
        description: "Update the task title specified by task UUId",
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "If the task does not exist",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "If the user is not member of the project where you want to update task, or if the user don't have sufficient privileges",
    }),
    (0, swagger_1.ApiParam)({ name: "id", type: "string", description: "task UUID" }),
    (0, swagger_1.ApiBody)({
        description: "Receive an new title",
        schema: {
            type: "object",
            properties: {
                newTitle: { type: "string", example: "My new title" },
            },
        },
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)("newTitle", not_empty_string_validation_pipe_1.NotEmptyStringValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "updateTitle", null);
__decorate([
    (0, common_1.Patch)("/update/description/:id"),
    (0, swagger_1.ApiOperation)({
        summary: "Update the task description",
        description: "Update the task description specified by task UUId",
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "If the task does not exist",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "If the user is not member of the project where you want to update task, or if the user don't have sufficient privileges",
    }),
    (0, swagger_1.ApiParam)({ name: "id", type: "string", description: "task UUID" }),
    (0, swagger_1.ApiBody)({
        description: "Receive an new description",
        schema: {
            type: "object",
            properties: {
                newDescription: { type: "string", example: "New description" },
            },
        },
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)("newDescription", not_empty_string_validation_pipe_1.NotEmptyStringValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "updateDescription", null);
__decorate([
    (0, common_1.Patch)("/update/start/:id"),
    (0, swagger_1.ApiOperation)({
        summary: "Update the task start date",
        description: "Update the start date of task specified by task UUId",
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "If the task does not exist",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "If the user is not member of the project where you want to update task, or if the user don't have sufficient privileges",
    }),
    (0, swagger_1.ApiParam)({ name: "id", type: "string", description: "task UUID" }),
    (0, swagger_1.ApiBody)({
        description: "Receive an timestamp of new start date",
        schema: {
            type: "object",
            properties: {
                newStart: { type: "string", example: "2023-05-18T16:27:50Z" },
            },
        },
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)("newStart", time_format_validation_pipe_1.TimeFormatValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Date]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "updateStart", null);
__decorate([
    (0, common_1.Patch)("/update/deadline/:id"),
    (0, swagger_1.ApiOperation)({
        summary: "Update the task deadline",
        description: "Update the deadline of task specified by task UUId",
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "If the task does not exist",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "If the user is not member of the project where you want to update task, or if the user don't have sufficient privileges",
    }),
    (0, swagger_1.ApiParam)({ name: "id", type: "string", description: "task UUID" }),
    (0, swagger_1.ApiBody)({
        description: "Receive an timestamp of new deadline",
        schema: {
            type: "object",
            properties: {
                newDeadline: { type: "string", example: "2023-05-23T16:27:50Z" },
            },
        },
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)("newDeadline", time_format_validation_pipe_1.TimeFormatValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Date]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "updateDeadline", null);
__decorate([
    (0, common_1.Patch)("/update/milestone/:id"),
    (0, swagger_1.ApiOperation)({
        summary: "Update the milestone status of task",
        description: "Update the milestone status of task specified by task UUId",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Return a whether this task is milestone or not",
        schema: {
            type: "object",
            properties: {
                milestone: { type: "boolean", example: true },
            },
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "If the task does not exist",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "If the user is not member of the project where you want to update task, or if the user don't have sufficient privileges",
    }),
    (0, swagger_1.ApiParam)({ name: "id", type: "string", description: "task UUID" }),
    (0, swagger_1.ApiBody)({
        description: "Receive a whether this task is milestone or not",
        schema: {
            type: "object",
            properties: {
                milestone: { type: "boolean", example: false },
            },
        },
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)("milestone", boolean_pipe_1.BooleanPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Boolean]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "updateMilestoneStatus", null);
__decorate([
    (0, common_1.Patch)("/update/finished/:id"),
    (0, swagger_1.ApiOperation)({
        summary: "Update the completion status of task",
        description: "Update the completion status of task specified by task UUId",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Return a whether this task is finished or not",
        schema: {
            type: "object",
            properties: {
                isFinished: { type: "boolean", example: true },
            },
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "If the task does not exist",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "If the user is not member of the task",
    }),
    (0, swagger_1.ApiParam)({ name: "id", type: "string", description: "task UUID" }),
    (0, swagger_1.ApiBody)({
        description: "Receive a whether this task is finished or not",
        schema: {
            type: "object",
            properties: {
                isFinished: { type: "boolean", example: false },
            },
        },
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)("isFinished", boolean_pipe_1.BooleanPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Boolean]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "updateFinishedStatus", null);
__decorate([
    (0, common_1.Post)("/create/column/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)("columnTitle", not_empty_string_validation_pipe_1.NotEmptyStringValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "createColumn", null);
__decorate([
    (0, common_1.Post)("/create/column/root/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)("columnTitle", not_empty_string_validation_pipe_1.NotEmptyStringValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "createColumnInRoot", null);
__decorate([
    (0, common_1.Patch)("/update/column/title/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)("newTitle", not_empty_string_validation_pipe_1.NotEmptyStringValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateColumnTitle", null);
__decorate([
    (0, common_1.Patch)("/append/column/before"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, append_column_dto_1.AppendColumnDto]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "appendColumnBefore", null);
__decorate([
    (0, common_1.Patch)("/append/column/after"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, append_column_dto_1.AppendColumnDto]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "appendColumnAfter", null);
__decorate([
    (0, common_1.Patch)("move/task/between/column"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        move_task_between_columns_dto_1.MoveTaskBetweenColumnsDto]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "moveTaskBetweenColumns", null);
__decorate([
    (0, common_1.Delete)("delete/column/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "deleteColumn", null);
__decorate([
    (0, common_1.Patch)("/append/before"),
    (0, swagger_1.ApiOperation)({
        summary: "Append tasks before other task",
        description: "Append task before other task having the same parent",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Returns the normally appended task and the non-appended as an array of UUIDs.",
        schema: {
            type: "object",
            properties: {
                taskId: { type: "string", description: "The UUID of task that predecessors will be attached" },
                appendedTaskIds: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                    description: "The UUIDs of tasks that normally be attached",
                },
                notFoundTaskIds: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                    description: "The UUIDs of tasks that cannot be found",
                },
                differentParentTaskIds: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                    description: "The UUIDs of tasks that have different parent from task specified by taskId",
                },
                alreadyPredecessorIds: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                    description: "The UUIDs of tasks that already are predecessor",
                },
            },
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "If the task does not exist",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "If the user is not member of the project where you want to update task, or if the user don't have sufficient privileges",
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        append_task_dto_1.AppendTaskDto]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "appendTaskBefore", null);
__decorate([
    (0, common_1.Patch)("/append/after"),
    (0, swagger_1.ApiOperation)({
        summary: "Append tasks after other task",
        description: "Append task after other task having the same parent",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Returns the normally appended task and the non-appended as an array of UUIDs.",
        schema: {
            type: "object",
            properties: {
                taskId: { type: "string", description: "The UUID of task that successors will be attached" },
                appendedTaskIds: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                    description: "The UUIDs of tasks that normally be attached",
                },
                notFoundTaskIds: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                    description: "The UUIDs of tasks that cannot be found",
                },
                differentParentTaskIds: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                    description: "The UUIDs of tasks that have different parent from task specified by taskId",
                },
                alreadyPredecessorIds: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                    description: "The UUIDs of tasks that already are successor",
                },
            },
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "If the task does not exist",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "If the user is not member of the project where you want to update task, or if the user don't have sufficient privileges",
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        append_task_dto_1.AppendTaskDto]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "appendTaskAfter", null);
__decorate([
    (0, common_1.Patch)("/bring/down/task"),
    (0, swagger_1.ApiOperation)({
        summary: "Bring down task under the other task",
        description: "Bring down task under the other task having the same parent",
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "If two tasks have different parent",
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "If tasks does not exist",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "If the user is not member of the project that you want to update task for, or if the user don't have sufficient privileges",
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, bring_down_task_dto_1.BringDownTaskDto]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "bringDownTask", null);
__decorate([
    (0, common_1.Patch)("/bring/up/task"),
    (0, swagger_1.ApiOperation)({
        summary: "Bring up task",
        description: "Bring up task to parent level",
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: "If task has no parent, so if task is root task of the project",
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "If tasks does not exist",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "If the user is not member of the project that you want to update task for, or if the user don't have sufficient privileges",
    }),
    (0, swagger_1.ApiBody)({
        description: "Recieve the UUID of task that will be brought up to parent level",
        schema: {
            type: "object",
            properties: { taskId: { type: "string" } },
        },
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)("taskId", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "bringUpTask", null);
__decorate([
    (0, common_1.Patch)("/invite/:id"),
    (0, swagger_1.ApiOperation)({
        summary: "Invite members to the task",
        description: "Invite members to the task specified by UUID",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Return normally added members and non-added as an array of UUID",
        schema: {
            type: "object",
            properties: {
                memberIds: {
                    type: "array",
                    items: { type: "string" },
                    description: "The UUIDs of members that be invited",
                },
                addedMemberIds: {
                    type: "array",
                    items: { type: "string" },
                    description: "The UUIDs of members that successfully be added",
                },
                notFoundUserIds: {
                    type: "array",
                    items: { type: "string" },
                    description: "The UUIDs of members that cannot be found",
                },
                notProjectMemberIds: {
                    type: "array",
                    items: { type: "string" },
                    description: "The UUIDs of members that is not member of the project",
                },
                alreadyTaskMemberIds: {
                    type: "array",
                    items: { type: "string" },
                    description: "The UUIDs of members that is already member of the task",
                },
            },
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "If task does not exist",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "If the user is not member of the project that you want to invite members to task for, or if the user don't have sufficient privileges",
    }),
    (0, swagger_1.ApiParam)({ name: "id", type: "string", description: "task UUID" }),
    (0, swagger_1.ApiBody)({
        description: "The UUIDs of members that will be invited",
        schema: {
            type: "object",
            properties: {
                memberIds: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
            },
        },
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)("memberIds")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Array]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "invite", null);
__decorate([
    (0, common_1.Patch)("/dismiss/:id"),
    (0, swagger_1.ApiOperation)({
        summary: "Dismiss members from the task",
        description: "Dismiss members from the task specified by UUID",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Return normally dismissed members and non-dismissed as an array of UUID",
        schema: {
            type: "object",
            properties: {
                memberIds: {
                    type: "array",
                    items: { type: "string" },
                    description: "The UUIDs of members that will be dismissed",
                },
                deletedMemberIds: {
                    type: "array",
                    items: { type: "string" },
                    description: "The UUIDs of members that successfully be dismissed",
                },
                notFoundUserIds: {
                    type: "array",
                    items: { type: "string" },
                    description: "The UUIDs of members that cannot be found",
                },
                alreadyNotTaskMemberIds: {
                    type: "array",
                    items: { type: "string" },
                    description: "The UUIDs of members that is already not member of the task",
                },
            },
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "If task does not exist",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "If the user is not member of the project that you want to dismiss members from task for, or if the user don't have sufficient privileges",
    }),
    (0, swagger_1.ApiParam)({ name: "id", type: "string", description: "task UUID" }),
    (0, swagger_1.ApiBody)({
        description: "The UUIDs of members that will be dismissed",
        schema: {
            type: "object",
            properties: {
                memberIds: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
            },
        },
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)("memberIds")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Array]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "dismiss", null);
__decorate([
    (0, common_1.Get)("/bookmark"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "getAllBookmarks", null);
__decorate([
    (0, common_1.Get)("/bookmark/folder"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "getAllBookmarkFolders", null);
__decorate([
    (0, common_1.Post)("/create/bookmark"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, create_bookmark_dto_1.CreateBookmarkDto]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "createBookmark", null);
__decorate([
    (0, common_1.Patch)("/bring/down/bookmark"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, bring_down_bookmark_dto_1.BringDownBookmarkDto]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "bringDownBookmark", null);
__decorate([
    (0, common_1.Patch)("/bring/up/bookmark"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)("bookmarkId", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "bringUpBookmark", null);
__decorate([
    (0, common_1.Patch)("/update/bookmark/title/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)("newTitle", not_empty_string_validation_pipe_1.NotEmptyStringValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateBookmarkTitle", null);
__decorate([
    (0, common_1.Delete)("/delete/bookmark/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "deleteBookmark", null);
__decorate([
    (0, common_1.Get)("/content/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "getAllContents", null);
__decorate([
    (0, common_1.Post)("/create/content/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "createContent", null);
__decorate([
    (0, common_1.Put)("/update/content/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)("content")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateContent", null);
__decorate([
    (0, common_1.Delete)("/delete/content/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "deleteContent", null);
__decorate([
    (0, common_1.Get)("/comment/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Query)("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "getAllComments", null);
__decorate([
    (0, common_1.Post)("/create/comment/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)("content", not_empty_string_validation_pipe_1.NotEmptyStringValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "createCommment", null);
__decorate([
    (0, common_1.Post)("/create/reply/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("commentId", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)("content", not_empty_string_validation_pipe_1.NotEmptyStringValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "createReply", null);
__decorate([
    (0, common_1.Patch)("/update/comment/content/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)("content", not_empty_string_validation_pipe_1.NotEmptyStringValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateCommentContent", null);
__decorate([
    (0, common_1.Patch)("/update/comment/fixed/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)("pinned", common_1.ParseBoolPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Boolean]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateCommentPinStatus", null);
__decorate([
    (0, common_1.Delete)("/delete/comment/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.Delete)("/delete"),
    (0, swagger_1.ApiOperation)({
        summary: "Delete the task",
        description: "Delete the task specified by UUID",
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "If task does not exist",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "If the user is not member of the project that you want to delete the task for, or if the user don't have sufficient privileges",
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, delete_task_dto_1.DeleteTaskDto]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "deleteTask", null);
TaskController = __decorate([
    (0, common_1.Controller)("task"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiTags)("Task API"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    __metadata("design:paramtypes", [task_service_1.TaskService])
], TaskController);
exports.TaskController = TaskController;
//# sourceMappingURL=task.controller.js.map