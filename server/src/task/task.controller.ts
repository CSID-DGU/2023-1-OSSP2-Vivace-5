import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    ParseBoolPipe,
    ParseUUIDPipe,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
    ValidationPipe,
} from "@nestjs/common";
import { TaskService } from "./task.service";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/decorator/get-user.decorator";
import { User } from "src/entity/user.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { AppendTaskDto } from "./dto/append-task.dto";
import { BringDownTaskDto } from "./dto/bring-down-task.dto";
import { NotEmptyStringValidationPipe } from "src/pipe/not-empty-string-validation.pipe";
import { TimeFormatValidationPipe } from "src/pipe/time-format.validation.pipe";
import { AppendColumnDto } from "./dto/append-column.dto";
import { MoveTaskBetweenColumnsDto } from "./dto/move-task-between-columns.dto";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { BringDownBookmarkDto } from "./dto/bring-down-bookmark.dto";
import { Task } from "src/entity/task.entity";
import { SubTask } from "src/enum/sub-task.enum";
import { BooleanPipe } from "src/pipe/boolean.pipe";
import { DeleteTaskDto } from "./dto/delete-task.dto";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { UserRight } from "src/enum/user-right.enum";

@Controller("task")
@UseGuards(AuthGuard())
@ApiTags("Task API")
@ApiBearerAuth("access-token")
export class TaskController {
    private logger = new Logger("TaskController");

    constructor(private taskService: TaskService) {}

    @Get("/:id")
    @ApiOperation({
        summary: "Get task info",
        description: "Get the information of task specified by the task ID.",
    })
    @ApiOkResponse({
        description: "Return the task object",
        schema: {
            type: "object",
            properties: {
                id: { type: "string", example: "1268c369-9f46-44f4-b3f9-0c0f14f25cd9" },
                title: { type: "string", example: "My first task" },
                description: { type: "string", example: "It will be a great work" },
                type: {
                    type: "enum",
                    enum: [SubTask.GRAPH, SubTask.KANBAN, SubTask.LIST, SubTask.TERMINAL],
                    example: SubTask.LIST,
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
                            enum: [SubTask.GRAPH, SubTask.KANBAN, SubTask.LIST],
                            example: SubTask.GRAPH,
                        },
                        encodedImg: {
                            type: "string",
                            example:
                                "data:image/jpeg;base64,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",
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
                                            UserRight.ADMIN,
                                            UserRight.COMPLETION_MOD,
                                            UserRight.MEMBER_AND_TASK_MGT,
                                            UserRight.MEMBER_MGT,
                                            UserRight.TASK_MGT,
                                        ],
                                        example: UserRight.ADMIN,
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
                            enum: [SubTask.GRAPH, SubTask.KANBAN, SubTask.LIST],
                            example: SubTask.LIST,
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
                                enum: [SubTask.GRAPH, SubTask.KANBAN, SubTask.LIST, SubTask.TERMINAL],
                                example: SubTask.TERMINAL,
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
    })
    @ApiNotFoundResponse({
        description: "If there is no task for the received ID, return the Not Found error.",
    })
    @ApiUnauthorizedResponse({
        description:
            "If the user who sent the request is not a member of this project including task, the user is not eligible to view the task information. So, returns an unauthorized error.",
    })
    @ApiParam({ name: "id", type: "string", description: "Task UUID" })
    getTaskInfo(@GetUser() user: User, @Param("id", ParseUUIDPipe) taskId: string): Promise<Task> {
        this.logger.verbose(`User ${user.email} trying to get the task information with id ${taskId}`);
        return this.taskService.getTaskInfo(user, taskId);
    }

    @Post("/create")
    @ApiOperation({
        summary: "Create a new task",
        description: "Create a new task",
    })
    @ApiOkResponse({
        description: "Return a object to contain id, title, description, type of the created task.",
        schema: {
            type: "object",
            properties: {
                id: { type: "string", example: "1268c369-9f46-44f4-b3f9-0c0f14f25cd9" },
                title: { type: "string", example: "Nested task" },
                description: { type: "string", example: "haha" },
                type: {
                    type: "enum",
                    enum: [SubTask.GRAPH, SubTask.KANBAN, SubTask.LIST, SubTask.TERMINAL],
                    example: SubTask.TERMINAL,
                },
            },
        },
    })
    @ApiBadRequestResponse({
        description:
            "If column Id is not designated as parentId even though it is a Kanban board, or if the parent's work is Kanban board when it is not designated as a Kanban board, or if the parent's work is terminal work.",
    })
    @ApiNotFoundResponse({
        description: "If the project does not exist, or if the parent work or parent column does not exist",
    })
    @ApiUnauthorizedResponse({
        description:
            "If the user is not member of the project that you want to create work for, or if the user don't have sufficient privileges",
    })
    createTask(
        @GetUser() user: User,
        @Body() createTaskDto: CreateTaskDto,
    ): Promise<{
        id: string;
        title: string;
        description: string;
        type: SubTask;
    }> {
        this.logger.verbose(`User ${user.email} trying to create a task`);
        return this.taskService.createTask(user, createTaskDto);
    }

    @Patch("/update/title/:id")
    @ApiOperation({
        summary: "Update the task title",
        description: "Update the task title specified by task UUId",
    })
    @ApiNotFoundResponse({
        description: "If the task does not exist",
    })
    @ApiUnauthorizedResponse({
        description:
            "If the user is not member of the project where you want to update task, or if the user don't have sufficient privileges",
    })
    @ApiParam({ name: "id", type: "string", description: "task UUID" })
    @ApiBody({
        description: "Receive an new title",
        schema: {
            type: "object",
            properties: {
                newTitle: { type: "string", example: "My new title" },
            },
        },
    })
    updateTitle(
        @GetUser() user: User,
        @Param("id", ParseUUIDPipe) taskId: string,
        @Body("newTitle", NotEmptyStringValidationPipe) newTitle: string,
    ): Promise<void> {
        this.logger.verbose(
            `User ${user.email} trying to update the title of task with id ${taskId} into new title ${newTitle}`,
        );
        return this.taskService.updateTitle(user, taskId, newTitle);
    }

    @Patch("/update/description/:id")
    @ApiOperation({
        summary: "Update the task description",
        description: "Update the task description specified by task UUId",
    })
    @ApiNotFoundResponse({
        description: "If the task does not exist",
    })
    @ApiUnauthorizedResponse({
        description:
            "If the user is not member of the project where you want to update task, or if the user don't have sufficient privileges",
    })
    @ApiParam({ name: "id", type: "string", description: "task UUID" })
    @ApiBody({
        description: "Receive an new description",
        schema: {
            type: "object",
            properties: {
                newDescription: { type: "string", example: "New description" },
            },
        },
    })
    updateDescription(
        @GetUser() user: User,
        @Param("id", ParseUUIDPipe) taskId: string,
        @Body("newDescription", NotEmptyStringValidationPipe) newDescription: string,
    ): Promise<void> {
        this.logger.verbose(`User ${user.email} trying to update the description of task with id ${taskId}`);
        return this.taskService.updateDescription(user, taskId, newDescription);
    }

    @Patch("/update/start/:id")
    @ApiOperation({
        summary: "Update the task start date",
        description: "Update the start date of task specified by task UUId",
    })
    @ApiNotFoundResponse({
        description: "If the task does not exist",
    })
    @ApiUnauthorizedResponse({
        description:
            "If the user is not member of the project where you want to update task, or if the user don't have sufficient privileges",
    })
    @ApiParam({ name: "id", type: "string", description: "task UUID" })
    @ApiBody({
        description: "Receive an timestamp of new start date",
        schema: {
            type: "object",
            properties: {
                newStart: { type: "string", example: "2023-05-18T16:27:50Z" },
            },
        },
    })
    updateStart(
        @GetUser() user: User,
        @Param("id", ParseUUIDPipe) taskId: string,
        @Body("newStart", TimeFormatValidationPipe) newStart: Date,
    ): Promise<void> {
        this.logger.verbose(`User ${user.email} trying to update the start date of task with id ${taskId}`);
        return this.taskService.updateStart(user, taskId, newStart);
    }

    @Patch("/update/deadline/:id")
    @ApiOperation({
        summary: "Update the task deadline",
        description: "Update the deadline of task specified by task UUId",
    })
    @ApiNotFoundResponse({
        description: "If the task does not exist",
    })
    @ApiUnauthorizedResponse({
        description:
            "If the user is not member of the project where you want to update task, or if the user don't have sufficient privileges",
    })
    @ApiParam({ name: "id", type: "string", description: "task UUID" })
    @ApiBody({
        description: "Receive an timestamp of new deadline",
        schema: {
            type: "object",
            properties: {
                newDeadline: { type: "string", example: "2023-05-23T16:27:50Z" },
            },
        },
    })
    updateDeadline(
        @GetUser() user: User,
        @Param("id", ParseUUIDPipe) taskId: string,
        @Body("newDeadline", TimeFormatValidationPipe) newDeadline: Date,
    ): Promise<void> {
        this.logger.verbose(`User ${user.email} trying to update the deadline of task with id ${taskId}`);
        return this.taskService.updateDeadline(user, taskId, newDeadline);
    }

    @Patch("/update/milestone/:id")
    @ApiOperation({
        summary: "Update the milestone status of task",
        description: "Update the milestone status of task specified by task UUId",
    })
    @ApiOkResponse({
        description: "Return a whether this task is milestone or not",
        schema: {
            type: "object",
            properties: {
                milestone: { type: "boolean", example: true },
            },
        },
    })
    @ApiNotFoundResponse({
        description: "If the task does not exist",
    })
    @ApiUnauthorizedResponse({
        description:
            "If the user is not member of the project where you want to update task, or if the user don't have sufficient privileges",
    })
    @ApiParam({ name: "id", type: "string", description: "task UUID" })
    @ApiBody({
        description: "Receive a whether this task is milestone or not",
        schema: {
            type: "object",
            properties: {
                milestone: { type: "boolean", example: false },
            },
        },
    })
    updateMilestoneStatus(
        @GetUser() user: User,
        @Param("id", ParseUUIDPipe) taskId: string,
        @Body("milestone", BooleanPipe) milestone: boolean,
    ): Promise<{ milestone: boolean }> {
        this.logger.verbose(`User ${user.email} trying to update whether task with id ${taskId} is milestone or not`);
        return this.taskService.updateMilestoneStatus(user, taskId, milestone);
    }

    @Patch("/update/finished/:id")
    @ApiOperation({
        summary: "Update the completion status of task",
        description: "Update the completion status of task specified by task UUId",
    })
    @ApiOkResponse({
        description: "Return a whether this task is finished or not",
        schema: {
            type: "object",
            properties: {
                isFinished: { type: "boolean", example: true },
            },
        },
    })
    @ApiNotFoundResponse({
        description: "If the task does not exist",
    })
    @ApiUnauthorizedResponse({
        description: "If the user is not member of the task",
    })
    @ApiParam({ name: "id", type: "string", description: "task UUID" })
    @ApiBody({
        description: "Receive a whether this task is finished or not",
        schema: {
            type: "object",
            properties: {
                isFinished: { type: "boolean", example: false },
            },
        },
    })
    updateFinishedStatus(
        @GetUser() user: User,
        @Param("id", ParseUUIDPipe) taskId: string,
        @Body("isFinished", BooleanPipe) isFinished: boolean,
    ): Promise<{ isFinished: boolean }> {
        this.logger.verbose(`User ${user.email} trying to update whether task with id ${taskId} is finished`);
        return this.taskService.updateFinishedStatus(user, taskId, isFinished);
    }

    @Post("/create/column/:id")
    createColumn(
        @GetUser() user: User,
        @Param("id", ParseUUIDPipe) taskId: string,
        @Body("columnTitle", NotEmptyStringValidationPipe) columnTitle: string,
    ) {}

    @Patch("/update/column/title/:id")
    updateColumnTitle(
        @GetUser() user: User,
        @Param("id", ParseUUIDPipe) columnId: string,
        @Body("newTitle", NotEmptyStringValidationPipe) newTitle: string,
    ) {}

    @Patch("/append/column/before")
    appendColumnBefore(@GetUser() user: User, @Body(ValidationPipe) appendColumnDto: AppendColumnDto) {}

    @Patch("/append/column/after")
    appendColumnAfter(@GetUser() user: User, @Body(ValidationPipe) appendColumnDto: AppendColumnDto) {}

    @Patch("move/task/between/column")
    moveTaskBetweenColumns(
        @GetUser() user: User,
        @Body(ValidationPipe) moveTaskBetweenColumnsDto: MoveTaskBetweenColumnsDto,
    ) {}

    @Delete("delete/column/:id")
    deleteColumn(@GetUser() user: User, @Param("id", ParseUUIDPipe) columnId: string) {}

    @Patch("/append/before")
    @ApiOperation({
        summary: "Append tasks before other task",
        description: "Append task before other task having the same parent",
    })
    @ApiOkResponse({
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
    })
    @ApiNotFoundResponse({
        description: "If the task does not exist",
    })
    @ApiUnauthorizedResponse({
        description:
            "If the user is not member of the project where you want to update task, or if the user don't have sufficient privileges",
    })
    appendTaskBefore(
        @GetUser() user: User,
        @Body() appendTaskDto: AppendTaskDto,
    ): Promise<{
        taskId: string;
        appendedTaskIds: string[];
        notFoundTaskIds: string[];
        differentParentTaskIds: string[];
        alreadyPredecessorIds: string[];
    }> {
        this.logger.verbose(`User ${user.email} trying to append some tasks before task ${appendTaskDto.taskId}`);
        return this.taskService.appendTaskBefore(user, appendTaskDto);
    }

    @Patch("/append/after")
    @ApiOperation({
        summary: "Append tasks after other task",
        description: "Append task after other task having the same parent",
    })
    @ApiOkResponse({
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
    })
    @ApiNotFoundResponse({
        description: "If the task does not exist",
    })
    @ApiUnauthorizedResponse({
        description:
            "If the user is not member of the project where you want to update task, or if the user don't have sufficient privileges",
    })
    appendTaskAfter(
        @GetUser() user: User,
        @Body() appendTaskDto: AppendTaskDto,
    ): Promise<{
        taskId: string;
        appendedTaskIds: string[];
        notFoundTaskIds: string[];
        differentParentTaskIds: string[];
        alreadyPredecessorIds: string[];
    }> {
        this.logger.verbose(`User ${user.email} trying to append some tasks after task ${appendTaskDto.taskId}`);
        return this.taskService.appendTaskAfter(user, appendTaskDto);
    }

    @Patch("/bring/down/task")
    @ApiOperation({
        summary: "Bring down task under the other task",
        description: "Bring down task under the other task having the same parent",
    })
    @ApiBadRequestResponse({
        description: "If two tasks have different parent",
    })
    @ApiNotFoundResponse({
        description: "If tasks does not exist",
    })
    @ApiUnauthorizedResponse({
        description:
            "If the user is not member of the project that you want to update task for, or if the user don't have sufficient privileges",
    })
    bringDownTask(@GetUser() user: User, @Body() bringDownDto: BringDownTaskDto): Promise<void> {
        this.logger.verbose(
            `User ${user.email} trying to bring down task ${bringDownDto.taskId} under the task ${bringDownDto.taskIdToParent}`,
        );
        return this.taskService.bringDownTask(user, bringDownDto);
    }

    @Patch("/bring/up/task")
    @ApiOperation({
        summary: "Bring up task",
        description: "Bring up task to parent level",
    })
    @ApiBadRequestResponse({
        description: "If task has no parent, so if task is root task of the project",
    })
    @ApiNotFoundResponse({
        description: "If tasks does not exist",
    })
    @ApiUnauthorizedResponse({
        description:
            "If the user is not member of the project that you want to update task for, or if the user don't have sufficient privileges",
    })
    @ApiBody({
        description: "Recieve the UUID of task that will be brought up to parent level",
        schema: {
            type: "object",
            properties: { taskId: { type: "string" } },
        },
    })
    bringUpTask(@GetUser() user: User, @Body("taskId", ParseUUIDPipe) taskId: string): Promise<void> {
        this.logger.verbose(`User ${user.email} trying to bring up task ${taskId}`);
        return this.taskService.bringUpTask(user, taskId);
    }

    @Patch("/invite/:id")
    @ApiOperation({
        summary: "Invite members to the task",
        description: "Invite members to the task specified by UUID",
    })
    @ApiOkResponse({
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
    })
    @ApiNotFoundResponse({
        description: "If task does not exist",
    })
    @ApiUnauthorizedResponse({
        description:
            "If the user is not member of the project that you want to invite members to task for, or if the user don't have sufficient privileges",
    })
    @ApiParam({ name: "id", type: "string", description: "task UUID" })
    @ApiBody({
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
    })
    invite(
        @GetUser() user: User,
        @Param("id", ParseUUIDPipe) taskId: string,
        @Body("memberIds") memberIds: string[],
    ): Promise<{
        memberIds: string[];
        addedMemberIds: string[];
        notFoundUserIds: string[];
        notProjectMemberIds: string[];
        alreadyTaskMemberIds: string[];
    }> {
        this.logger.verbose(`User ${user.email} trying to invite members to task with id ${taskId}`);
        return this.taskService.invite(user, taskId, memberIds);
    }

    @Patch("/dismiss/:id")
    @ApiOperation({
        summary: "Dismiss members from the task",
        description: "Dismiss members from the task specified by UUID",
    })
    @ApiOkResponse({
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
    })
    @ApiNotFoundResponse({
        description: "If task does not exist",
    })
    @ApiUnauthorizedResponse({
        description:
            "If the user is not member of the project that you want to dismiss members from task for, or if the user don't have sufficient privileges",
    })
    @ApiParam({ name: "id", type: "string", description: "task UUID" })
    @ApiBody({
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
    })
    dismiss(
        @GetUser() user: User,
        @Param("id", ParseUUIDPipe) taskId: string,
        @Body("memberIds") memberIds: string[],
    ): Promise<{
        memberIds: string[];
        deletedMemberIds: string[];
        notFoundUserIds: string[];
        alreadyNotTaskMemberIds: string[];
    }> {
        this.logger.verbose(`User ${user.email} trying to dismiss members from task with id ${taskId}`);
        return this.taskService.dismiss(user, taskId, memberIds);
    }

    @Get("/bookmark")
    getAllBookmarks(@GetUser() user: User, @Query("q") query: string) {
        return this.taskService.getAllBookmarks(user, query);
    }

    @Get("/bookmark/folder")
    getAllBookmarkFolders(@GetUser() user: User) {}

    @Post("/create/bookmark")
    createBookmark(@GetUser() user: User, @Body() createBookmarkDto: CreateBookmarkDto) {}

    @Patch("/bring/down/bookmark")
    bringDownBookmark(@GetUser() user: User, @Body() bringDownBookmarkDto: BringDownBookmarkDto) {}

    @Patch("/bring/up/bookmark")
    bringUpBookmark(@GetUser() user: User, @Body("bookmarkId", ParseUUIDPipe) bookmarkId: string) {}

    @Patch("/update/bookmark/title/:id")
    updateBookmarkTitle(
        @GetUser() user: User,
        @Param("id", ParseUUIDPipe) bookmarkId: string,
        @Body("newTitle", NotEmptyStringValidationPipe) newTitle: string,
    ) {}

    @Delete("/delete/bookmark/:id")
    deleteBookmark(@GetUser() user: User, @Param("id", ParseUUIDPipe) bookmarkId: string) {}

    @Get("/content/:id")
    getAllContents(@GetUser() user: User, @Param("id", ParseUUIDPipe) taskId: string) {}

    @Post("/create/content/:id")
    createContent(@GetUser() user: User, @Param("id", ParseUUIDPipe) taskId: string) {}

    @Put("/update/content/:id")
    updateContent(
        @GetUser() user: User,
        @Param("id", ParseUUIDPipe) contentId: string,
        @Body("content") content: string,
    ) {}

    @Delete("/delete/content/:id")
    deleteContent(@GetUser() user: User, @Param("id", ParseUUIDPipe) contentId: string) {}

    @Get("/comment/:id")
    getAllComments(@GetUser() user: User, @Param("id", ParseUUIDPipe) taskId: string, @Query("q") query: string) {}

    @Post("/create/comment/:id")
    createCommment(
        @GetUser() user: User,
        @Param("id", ParseUUIDPipe) taskId: string,
        @Body("content", NotEmptyStringValidationPipe) content: string,
    ) {}

    @Post("/create/reply/:id")
    createReply(
        @GetUser() user: User,
        @Param("commentId", ParseUUIDPipe) commentId: string,
        @Body("content", NotEmptyStringValidationPipe) content: string,
    ) {}

    @Patch("/update/comment/content/:id")
    updateCommentContent(
        @GetUser() user: User,
        @Param("id", ParseUUIDPipe) commentId: string,
        @Body("content", NotEmptyStringValidationPipe) content: string,
    ) {}

    @Patch("/update/comment/fixed/:id")
    updateCommentPinStatus(
        @GetUser() user: User,
        @Param("id", ParseUUIDPipe) commentId: string,
        @Body("pinned", ParseBoolPipe) pinned: boolean,
    ) {}

    @Delete("/delete/comment/:id")
    deleteComment(@GetUser() user: User, @Param("id", ParseUUIDPipe) commentId: string) {}

    @Delete("/delete")
    @ApiOperation({
        summary: "Delete the task",
        description: "Delete the task specified by UUID",
    })
    @ApiNotFoundResponse({
        description: "If task does not exist",
    })
    @ApiUnauthorizedResponse({
        description:
            "If the user is not member of the project that you want to delete the task for, or if the user don't have sufficient privileges",
    })
    deleteTask(@GetUser() user: User, @Body() deleteTaskDto: DeleteTaskDto): Promise<void> {
        this.logger.verbose(`User ${user.email} trying to delete the task with id ${deleteTaskDto.taskId}`);
        return this.taskService.deleteTask(user, deleteTaskDto);
    }
}
