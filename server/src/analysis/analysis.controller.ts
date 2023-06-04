import { Controller, Get, Logger, Param, ParseUUIDPipe, UseGuards } from "@nestjs/common";
import { AnalysisService } from "./analysis.service";
import { GetUser } from "src/decorator/get-user.decorator";
import { User } from "src/entity/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { Task } from "src/entity/task.entity";
import { Relation } from "src/enum/relation.enum";
import {
    ApiBearerAuth,
    ApiNotAcceptableResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { SubTask } from "src/enum/sub-task.enum";

@Controller("analysis")
@UseGuards(AuthGuard())
@ApiTags("Analysis API")
@ApiBearerAuth("access-token")
export class AnalysisController {
    private logger = new Logger("AnalysisController");

    constructor(private analysisService: AnalysisService) {}

    @Get("/todo/project/:projectId")
    @ApiOperation({
        summary: "Get todo list in root level",
        description: "Get todo list in root level",
    })
    @ApiOkResponse({
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
    })
    @ApiNotFoundResponse({
        description: "If ths project specified by uuid is not found",
    })
    @ApiUnauthorizedResponse({
        description: "If the user is not member of this project",
    })
    @ApiNotAcceptableResponse({
        description: "If the project type is not a GRAPH",
    })
    @ApiParam({ name: "projectId", type: "string", description: "project UUID" })
    getRootTodo(
        @GetUser() user: User,
        @Param("projectId", ParseUUIDPipe) projectId: string,
    ): Promise<{ todo: Task[]; cycles: Set<Task>[] }> {
        this.logger.verbose(`User ${user.email} trying to get todo list of root task in project ${projectId}`);
        return this.analysisService.getRootTodo(user, projectId);
    }

    @Get("/todo/task/:parentId")
    @ApiOperation({
        summary: "Get todo list not in root level",
        description: "Get todo list not in root level",
    })
    @ApiOkResponse({
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
    })
    @ApiNotFoundResponse({
        description: "If ths parent task specified by uuid is not found",
    })
    @ApiUnauthorizedResponse({
        description: "If the user is not member of this project",
    })
    @ApiNotAcceptableResponse({
        description: "If the project type is not a GRAPH",
    })
    @ApiParam({ name: "parentId", type: "string", description: "parent task UUID" })
    getTodo(
        @GetUser() user: User,
        @Param("parentId", ParseUUIDPipe) parentId: string,
    ): Promise<{ todo: Task[]; cycles: Set<Task>[] }> {
        this.logger.verbose(`User ${user.email} trying to get todo list in children of task ${parentId}`);
        return this.analysisService.getTodo(user, parentId);
    }

    @Get("/relation/:t1/:t2")
    @ApiOperation({
        summary: "Get relationship between two tasks",
        description: "Get relationship between two tasks having same parent",
    })
    @ApiOkResponse({
        description: "Return how the first task relates to the second task.",
        schema: {
            type: "object",
            properties: {
                relation: {
                    type: "enum",
                    enum: [Relation.FIRST, Relation.LATER, Relation.NO],
                    description: "Indicate how the first task relates to the second task",
                },
            },
        },
    })
    @ApiNotFoundResponse({
        description: "The two tasks specified by uuid is not found.",
    })
    @ApiUnauthorizedResponse({
        description: "The user is not member of this project",
    })
    @ApiNotAcceptableResponse({
        description: "The two tasks specified by uuid has different parent",
    })
    @ApiParam({ name: "t1", type: "string", description: "First Task UUID" })
    @ApiParam({ name: "t2", type: "string", description: "Second Task UUID" })
    getRelation(
        @GetUser() user: User,
        @Param("t1", ParseUUIDPipe) firstTaskId: string,
        @Param("t2", ParseUUIDPipe) secondTaskId: string,
    ): Promise<{ relation: Relation }> {
        this.logger.verbose(
            `User ${user.email} trying to get relation between task ${firstTaskId} and task ${secondTaskId}`,
        );
        return this.analysisService.getRelation(user, firstTaskId, secondTaskId);
    }

    @Get("/user/tasks/project/:projectId/:memberId")
    @ApiOperation({
        summary: "Get tasks of other member in the top-level of project",
        description: "Get tasks of other member in the top-level of project",
    })
    @ApiOkResponse({
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
                                example: SubTask.GRAPH,
                                enum: [SubTask.GRAPH, SubTask.KANBAN, SubTask.TERMINAL, SubTask.LIST],
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
                                example: SubTask.GRAPH,
                                enum: [SubTask.GRAPH, SubTask.KANBAN, SubTask.TERMINAL, SubTask.LIST],
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
                                example: SubTask.GRAPH,
                                enum: [SubTask.GRAPH, SubTask.KANBAN, SubTask.TERMINAL, SubTask.LIST],
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
    })
    @ApiNotFoundResponse({
        description: "The project is not found. Or, the user and member is not of the project.",
    })
    @ApiParam({ name: "projectId", type: "string", description: "Project UUID" })
    @ApiParam({ name: "memberId", type: "string", description: "Member UUID that you want to know tasks of" })
    getMemberTasksInRoot(
        @GetUser() user: User,
        @Param("projectId", ParseUUIDPipe) projectId: string,
        @Param("memberId", ParseUUIDPipe) memberId: string,
    ): Promise<{ myTasks: Task[]; yourTasks: Task[]; intersection: Task[] }> {
        this.logger.verbose(
            `User ${user.email} trying to get root tasks of member ${memberId} in the project ${projectId}`,
        );
        return this.analysisService.getMemberTasksInRoot(user, projectId, memberId);
    }

    @Get("/user/tasks/task/:parentId/:memberId")
    @ApiOperation({
        summary: "Get tasks of other member under some task",
        description: "Get tasks of other member under some task",
    })
    @ApiOkResponse({
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
                                example: SubTask.GRAPH,
                                enum: [SubTask.GRAPH, SubTask.KANBAN, SubTask.TERMINAL, SubTask.LIST],
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
                                example: SubTask.GRAPH,
                                enum: [SubTask.GRAPH, SubTask.KANBAN, SubTask.TERMINAL, SubTask.LIST],
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
                                example: SubTask.GRAPH,
                                enum: [SubTask.GRAPH, SubTask.KANBAN, SubTask.TERMINAL, SubTask.LIST],
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
    })
    @ApiNotFoundResponse({
        description: "The parent task is not found. Or, the user and member is not of the project.",
    })
    @ApiParam({ name: "parentId", type: "string", description: "Parent Task UUID" })
    @ApiParam({ name: "memberId", type: "string", description: "Member UUID that you want to know tasks of" })
    getMemberTasks(
        @GetUser() user: User,
        @Param("parentId", ParseUUIDPipe) parentId: string,
        @Param("memberId", ParseUUIDPipe) memberId: string,
    ): Promise<{ myTasks: Task[]; yourTasks: Task[]; intersection: Task[] }> {
        this.logger.verbose(
            `User ${user.email} trying to get tasks of member ${memberId} in the child of task ${parentId}`,
        );
        return this.analysisService.getMemberTasks(user, parentId, memberId);
    }
}
