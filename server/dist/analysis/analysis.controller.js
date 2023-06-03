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
exports.AnalysisController = void 0;
const common_1 = require("@nestjs/common");
const analysis_service_1 = require("./analysis.service");
const get_user_decorator_1 = require("../decorator/get-user.decorator");
const user_entity_1 = require("../entity/user.entity");
const passport_1 = require("@nestjs/passport");
const relation_enum_1 = require("../enum/relation.enum");
const swagger_1 = require("@nestjs/swagger");
const sub_task_enum_1 = require("../enum/sub-task.enum");
let AnalysisController = class AnalysisController {
    constructor(analysisService) {
        this.analysisService = analysisService;
        this.logger = new common_1.Logger("AnalysisController");
    }
    getRootTodo(user, projectId) {
        this.logger.verbose(`User ${user.email} trying to get todo list of root task in project ${projectId}`);
        return this.analysisService.getRootTodo(user, projectId);
    }
    getTodo(user, parentId) {
        this.logger.verbose(`User ${user.email} trying to get todo list in children of task ${parentId}`);
        return this.analysisService.getTodo(user, parentId);
    }
    getRelation(user, firstTaskId, secondTaskId) {
        this.logger.verbose(`User ${user.email} trying to get relation between task ${firstTaskId} and task ${secondTaskId}`);
        return this.analysisService.getRelation(user, firstTaskId, secondTaskId);
    }
    getMemberTasksInRoot(user, projectId, memberId) {
        this.logger.verbose(`User ${user.email} trying to get root tasks of member ${memberId} in the project ${projectId}`);
        return this.analysisService.getMemberTasksInRoot(user, projectId, memberId);
    }
    getMemberTasks(user, parentId, memberId) {
        this.logger.verbose(`User ${user.email} trying to get tasks of member ${memberId} in the child of task ${parentId}`);
        return this.analysisService.getMemberTasks(user, parentId, memberId);
    }
};
__decorate([
    (0, common_1.Get)("/todo/project/:projectId"),
    (0, swagger_1.ApiOperation)({
        summary: "Get todo list in root level",
        description: "Get todo list in root level",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Return todo list and cycles in the project top level",
        schema: {
            type: "object",
            properties: {
                todo: {
                    type: "array",
                    items: {
                        type: "object",
                    },
                    description: "array indicating todo list",
                },
                cycles: { type: "array", items: { type: "array" }, description: "set of cycles" },
            },
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "If ths project specified by uuid is not found",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "If the user is not member of this project",
    }),
    (0, swagger_1.ApiNotAcceptableResponse)({
        description: "If the project type is not a GRAPH",
    }),
    (0, swagger_1.ApiParam)({ name: "projectId", type: "string", description: "project UUID" }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("projectId", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "getRootTodo", null);
__decorate([
    (0, common_1.Get)("/todo/task/:parentId"),
    (0, swagger_1.ApiOperation)({
        summary: "Get todo list not in root level",
        description: "Get todo list not in root level",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Return todo list and cycles in the project non-top level",
        schema: {
            type: "object",
            properties: {
                todo: {
                    type: "array",
                    items: {
                        type: "object",
                    },
                    description: "array indicating todo list",
                },
                cycles: { type: "array", items: { type: "array" }, description: "set of cycles" },
            },
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "If ths parent task specified by uuid is not found",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "If the user is not member of this project",
    }),
    (0, swagger_1.ApiNotAcceptableResponse)({
        description: "If the project type is not a GRAPH",
    }),
    (0, swagger_1.ApiParam)({ name: "parentId", type: "string", description: "parent task UUID" }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("parentId", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "getTodo", null);
__decorate([
    (0, common_1.Get)("/relation/:t1/:t2"),
    (0, swagger_1.ApiOperation)({
        summary: "Get relationship between two tasks",
        description: "Get relationship between two tasks having same parent",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Return how the first task relates to the second task.",
        schema: {
            type: "object",
            properties: {
                relation: {
                    type: "enum",
                    enum: [relation_enum_1.Relation.FIRST, relation_enum_1.Relation.LATER, relation_enum_1.Relation.NO],
                    description: "Indicate how the first task relates to the second task",
                },
            },
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "The two tasks specified by uuid is not found.",
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "The user is not member of this project",
    }),
    (0, swagger_1.ApiNotAcceptableResponse)({
        description: "The two tasks specified by uuid has different parent",
    }),
    (0, swagger_1.ApiParam)({ name: "t1", type: "string", description: "First Task UUID" }),
    (0, swagger_1.ApiParam)({ name: "t2", type: "string", description: "Second Task UUID" }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("t1", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)("t2", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "getRelation", null);
__decorate([
    (0, common_1.Get)("/user/tasks/project/:projectId/:memberId"),
    (0, swagger_1.ApiOperation)({
        summary: "Get tasks of other member in the top-level of project",
        description: "Get tasks of other member in the top-level of project",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Return my tasks, tasks of the user specified by uuid, and their intersection",
        schema: {
            type: "object",
            properties: {
                myTasks: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", example: "4d3dd1ca-2744-4045-b08e-b40d3cbcca3a" },
                            title: { type: "string", example: "Nested Nested~~" },
                            description: { type: "string", example: "hio" },
                            type: {
                                type: "enum",
                                example: sub_task_enum_1.SubTask.GRAPH,
                                enum: [sub_task_enum_1.SubTask.GRAPH, sub_task_enum_1.SubTask.KANBAN, sub_task_enum_1.SubTask.TERMINAL, sub_task_enum_1.SubTask.LIST],
                            },
                            milestone: { type: "boolean", example: false },
                            createdAt: { type: "string", example: "2023-05-31T16:17:25.000Z" },
                            start: { type: "string", example: "2023-05-18T16:27:50.000Z" },
                            end: { type: "string", example: null },
                            deadline: { type: "string", example: "2023-05-23T16:27:50.000Z" },
                            isFinished: { type: "boolean", example: false },
                            parentColumnId: { type: "string", example: null },
                            projectId: { type: "string", example: "3148412e-1a62-46dc-97b2-b84a27eaffe8" },
                        },
                    },
                },
                yourTasks: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", example: "4d3dd1ca-2744-4045-b08e-b40d3cbcca3a" },
                            title: { type: "string", example: "Nested Nested~~" },
                            description: { type: "string", example: "hio" },
                            type: {
                                type: "enum",
                                example: sub_task_enum_1.SubTask.GRAPH,
                                enum: [sub_task_enum_1.SubTask.GRAPH, sub_task_enum_1.SubTask.KANBAN, sub_task_enum_1.SubTask.TERMINAL, sub_task_enum_1.SubTask.LIST],
                            },
                            milestone: { type: "boolean", example: false },
                            createdAt: { type: "string", example: "2023-05-31T16:17:25.000Z" },
                            start: { type: "string", example: "2023-05-18T16:27:50.000Z" },
                            end: { type: "string", example: null },
                            deadline: { type: "string", example: "2023-05-23T16:27:50.000Z" },
                            isFinished: { type: "boolean", example: false },
                            parentColumnId: { type: "string", example: null },
                            projectId: { type: "string", example: "3148412e-1a62-46dc-97b2-b84a27eaffe8" },
                        },
                    },
                },
                intersection: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", example: "4d3dd1ca-2744-4045-b08e-b40d3cbcca3a" },
                            title: { type: "string", example: "Nested Nested~~" },
                            description: { type: "string", example: "hio" },
                            type: {
                                type: "enum",
                                example: sub_task_enum_1.SubTask.GRAPH,
                                enum: [sub_task_enum_1.SubTask.GRAPH, sub_task_enum_1.SubTask.KANBAN, sub_task_enum_1.SubTask.TERMINAL, sub_task_enum_1.SubTask.LIST],
                            },
                            milestone: { type: "boolean", example: false },
                            createdAt: { type: "string", example: "2023-05-31T16:17:25.000Z" },
                            start: { type: "string", example: "2023-05-18T16:27:50.000Z" },
                            end: { type: "string", example: null },
                            deadline: { type: "string", example: "2023-05-23T16:27:50.000Z" },
                            isFinished: { type: "boolean", example: false },
                            parentColumnId: { type: "string", example: null },
                            projectId: { type: "string", example: "3148412e-1a62-46dc-97b2-b84a27eaffe8" },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "The project is not found. Or, the user and member is not of the project.",
    }),
    (0, swagger_1.ApiParam)({ name: "projectId", type: "string", description: "Project UUID" }),
    (0, swagger_1.ApiParam)({ name: "memberId", type: "string", description: "Member UUID that you want to know tasks of" }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("projectId", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)("memberId", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "getMemberTasksInRoot", null);
__decorate([
    (0, common_1.Get)("/user/tasks/task/:parentId/:memberId"),
    (0, swagger_1.ApiOperation)({
        summary: "Get tasks of other member under some task",
        description: "Get tasks of other member under some task",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Return my tasks, tasks of the user specified by uuid, and their intersection",
        schema: {
            type: "object",
            properties: {
                myTasks: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", example: "4d3dd1ca-2744-4045-b08e-b40d3cbcca3a" },
                            title: { type: "string", example: "Nested Nested~~" },
                            description: { type: "string", example: "hio" },
                            type: {
                                type: "enum",
                                example: sub_task_enum_1.SubTask.GRAPH,
                                enum: [sub_task_enum_1.SubTask.GRAPH, sub_task_enum_1.SubTask.KANBAN, sub_task_enum_1.SubTask.TERMINAL, sub_task_enum_1.SubTask.LIST],
                            },
                            milestone: { type: "boolean", example: false },
                            createdAt: { type: "string", example: "2023-05-31T16:17:25.000Z" },
                            start: { type: "string", example: "2023-05-18T16:27:50.000Z" },
                            end: { type: "string", example: null },
                            deadline: { type: "string", example: "2023-05-23T16:27:50.000Z" },
                            isFinished: { type: "boolean", example: false },
                            parentColumnId: { type: "string", example: null },
                            projectId: { type: "string", example: "3148412e-1a62-46dc-97b2-b84a27eaffe8" },
                        },
                    },
                },
                yourTasks: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", example: "4d3dd1ca-2744-4045-b08e-b40d3cbcca3a" },
                            title: { type: "string", example: "Nested Nested~~" },
                            description: { type: "string", example: "hio" },
                            type: {
                                type: "enum",
                                example: sub_task_enum_1.SubTask.GRAPH,
                                enum: [sub_task_enum_1.SubTask.GRAPH, sub_task_enum_1.SubTask.KANBAN, sub_task_enum_1.SubTask.TERMINAL, sub_task_enum_1.SubTask.LIST],
                            },
                            milestone: { type: "boolean", example: false },
                            createdAt: { type: "string", example: "2023-05-31T16:17:25.000Z" },
                            start: { type: "string", example: "2023-05-18T16:27:50.000Z" },
                            end: { type: "string", example: null },
                            deadline: { type: "string", example: "2023-05-23T16:27:50.000Z" },
                            isFinished: { type: "boolean", example: false },
                            parentColumnId: { type: "string", example: null },
                            projectId: { type: "string", example: "3148412e-1a62-46dc-97b2-b84a27eaffe8" },
                        },
                    },
                },
                intersection: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", example: "4d3dd1ca-2744-4045-b08e-b40d3cbcca3a" },
                            title: { type: "string", example: "Nested Nested~~" },
                            description: { type: "string", example: "hio" },
                            type: {
                                type: "enum",
                                example: sub_task_enum_1.SubTask.GRAPH,
                                enum: [sub_task_enum_1.SubTask.GRAPH, sub_task_enum_1.SubTask.KANBAN, sub_task_enum_1.SubTask.TERMINAL, sub_task_enum_1.SubTask.LIST],
                            },
                            milestone: { type: "boolean", example: false },
                            createdAt: { type: "string", example: "2023-05-31T16:17:25.000Z" },
                            start: { type: "string", example: "2023-05-18T16:27:50.000Z" },
                            end: { type: "string", example: null },
                            deadline: { type: "string", example: "2023-05-23T16:27:50.000Z" },
                            isFinished: { type: "boolean", example: false },
                            parentColumnId: { type: "string", example: null },
                            projectId: { type: "string", example: "3148412e-1a62-46dc-97b2-b84a27eaffe8" },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "The parent task is not found. Or, the user and member is not of the project.",
    }),
    (0, swagger_1.ApiParam)({ name: "parentId", type: "string", description: "Parent Task UUID" }),
    (0, swagger_1.ApiParam)({ name: "memberId", type: "string", description: "Member UUID that you want to know tasks of" }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("parentId", common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Param)("memberId", common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", Promise)
], AnalysisController.prototype, "getMemberTasks", null);
AnalysisController = __decorate([
    (0, common_1.Controller)("analysis"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiTags)("Analysis API"),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    __metadata("design:paramtypes", [analysis_service_1.AnalysisService])
], AnalysisController);
exports.AnalysisController = AnalysisController;
//# sourceMappingURL=analysis.controller.js.map