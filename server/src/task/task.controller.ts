import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
    ValidationPipe,
} from "@nestjs/common";
import { TaskService } from "./task.service";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/user/get-user.decorator";
import { User } from "src/entity/user.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { AppendTaskDto } from "./dto/append-task.dto";
import { BringDownTaskDto } from "./dto/bring-down-task.dto";
import { BooleanValidationPipe } from "src/pipe/boolean-validation.pipe";
import { UUIDValidationPipe } from "src/pipe/uuid-validation.pipe";
import { NotEmptyStringValidationPipe } from "src/pipe/not-empty-string-validation.pipe";
import { UTCTimeFormatValidationPipe } from "src/pipe/utc-time-format.validation.pipe";
import { AppendColumnDto } from "./dto/append-column.dto";
import { MoveTaskBetweenColumnsDto } from "./dto/move-task-between-columns.dto";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { BringDownBookmarkDto } from "./dto/bring-down-bookmark.dto";

@Controller("task")
@UseGuards(AuthGuard())
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Get("/:id")
    getTaskInfo(@GetUser() user: User, @Param("id", UUIDValidationPipe) taskId: string) {}

    @Post("/create")
    createTask(@GetUser() user: User, @Body(ValidationPipe) createTaskDto: CreateTaskDto) {}

    @Post("/copy/:id")
    copyTask(@GetUser() user: User, @Param("id", UUIDValidationPipe) taskId: string) {}

    @Patch("/update/title/:id")
    updateTaskTitle(
        @GetUser() user: User,
        @Param("id", UUIDValidationPipe) taskId: string,
        @Body("newTitle", NotEmptyStringValidationPipe) newTitle: string,
    ) {}

    @Patch("/update/description/:id")
    updateDescription(
        @GetUser() user: User,
        @Param("id", UUIDValidationPipe) taskId: string,
        @Body("newDescription", NotEmptyStringValidationPipe) newDescription: string,
    ) {}

    @Patch("/update/start/:id")
    updateStart(
        @GetUser() user: User,
        @Param("id", UUIDValidationPipe) taskId: string,
        @Body("newStart", UTCTimeFormatValidationPipe) newStart: Date,
    ) {}

    @Patch("/update/deadline/:id")
    updateDeadline(
        @GetUser() user: User,
        @Param("id", UUIDValidationPipe) taskId: string,
        @Body("newDeadline", UTCTimeFormatValidationPipe) newDeadline: Date,
    ) {}

    @Patch("/update/milstone/:id")
    updateMilestoneStatue(
        @GetUser() user: User,
        @Param("id", UUIDValidationPipe) taskId: string,
        @Body("isMilestone", BooleanValidationPipe) isMilestone: boolean,
    ) {}

    @Patch("/update/finished/:id")
    updateFinishedStatue(
        @GetUser() user: User,
        @Param("id", UUIDValidationPipe) taskId: string,
        @Body("isFinished", BooleanValidationPipe) isFinished: boolean,
    ) {}

    @Post("/create/column/:id")
    createColumn(
        @GetUser() user: User,
        @Param("id", UUIDValidationPipe) taskId: string,
        @Body("columnTitle", NotEmptyStringValidationPipe) columnTitle: string,
    ) {}

    @Patch("/update/column/title/:id")
    updateColumnTitle(
        @GetUser() user: User,
        @Param("id", UUIDValidationPipe) columnId: string,
        @Body("newTitle", NotEmptyStringValidationPipe) newTitle: string,
    ) {}

    @Patch("/append/before")
    appendColumnBefore(@GetUser() user: User, @Body(ValidationPipe) appendColumnDto: AppendColumnDto) {}

    @Patch("/append/after")
    appendColumnAfter(@GetUser() user: User, @Body(ValidationPipe) appendColumnDto: AppendColumnDto) {}

    @Patch("move/task/between/column")
    moveTaskBetweenColumns(
        @GetUser() user: User,
        @Body(ValidationPipe) moveTaskBetweenColumnsDto: MoveTaskBetweenColumnsDto,
    ) {}

    @Delete("delete/column/:id")
    deleteColumn(@GetUser() user: User, @Param("id", UUIDValidationPipe) columnId: string) {}

    @Patch("/append/before")
    appendTaskBefore(@GetUser() user: User, @Body(ValidationPipe) appendTaskDto: AppendTaskDto) {}

    @Patch("/append/after")
    appendTaskAfter(@GetUser() user: User, @Body(ValidationPipe) appendTaskDto: AppendTaskDto) {}

    @Patch("/bring/down/task")
    bringDownTask(@GetUser() user: User, @Body(ValidationPipe) bringDownDto: BringDownTaskDto) {}

    @Patch("/bring/up/task")
    bringUpTask(@GetUser() user: User, @Body("taskId", UUIDValidationPipe) taskId: string) {}

    @Patch("/invite/:id")
    invite(
        @GetUser() user: User,
        @Param("id", UUIDValidationPipe) taskId: string,
        @Body("memberId") memberId: string[],
    ) {}

    @Patch("/dismiss/:id")
    dismiss(
        @GetUser() user: User,
        @Param("id", UUIDValidationPipe) taskId: string,
        @Body("memberId") memberId: string[],
    ) {}

    @Get("/bookmark")
    getAllBookmarks(@GetUser() user: User, @Query("q") query: string) {}

    @Get("/bookmark/folder")
    getAllBookmarkFolders(@GetUser() user: User) {}

    @Post("/create/bookmark")
    createBookmark(@GetUser() user: User, @Body(ValidationPipe) createBookmarkDto: CreateBookmarkDto) {}

    @Patch("/bring/down/bookmark")
    bringDownBookmark(@GetUser() user: User, @Body(ValidationPipe) bringDownBookmarkDto: BringDownBookmarkDto) {}

    @Patch("/bring/up/bookmark")
    bringUpBookmark(@GetUser() user: User, @Body("bookmarkId", UUIDValidationPipe) bookmarkId: string) {}

    @Patch("/update/bookmark/title/:id")
    updateBookmarkTitle(
        @GetUser() user: User,
        @Param("id", UUIDValidationPipe) bookmarkId: string,
        @Body("newTitle", NotEmptyStringValidationPipe) newTitle: string,
    ) {}

    @Delete("/delete/bookmark/:id")
    deleteBookmark(@GetUser() user: User, @Param("id", UUIDValidationPipe) bookmarkId: string) {}

    @Get("/content/:id")
    getAllContents(@GetUser() user: User, @Param("id", UUIDValidationPipe) taskId: string) {}

    @Post("/create/content/:id")
    createContent(@GetUser() user: User, @Param("id", UUIDValidationPipe) taskId: string) {}

    @Put("/update/content/:id")
    updateContent(
        @GetUser() user: User,
        @Param("id", UUIDValidationPipe) contentId: string,
        @Body("content") content: string,
    ) {}

    @Delete("/delete/content/:id")
    deleteContent(@GetUser() user: User, @Param("id", UUIDValidationPipe) contentId: string) {}

    @Get("/comment/:id")
    getAllComments(@GetUser() user: User, @Param("id", UUIDValidationPipe) taskId: string, @Query("q") query: string) {}

    @Post("/create/comment/:id")
    createCommment(
        @GetUser() user: User,
        @Param("id", UUIDValidationPipe) taskId: string,
        @Body("content", NotEmptyStringValidationPipe) content: string,
    ) {}

    @Post("/create/reply/:id")
    addReply(
        @GetUser() user: User,
        @Param("commentId", UUIDValidationPipe) commentId: string,
        @Body("content", NotEmptyStringValidationPipe) content: string,
    ) {}

    @Patch("/update/comment/content/:id")
    updateCommentContent(
        @GetUser() user: User,
        @Param("id", UUIDValidationPipe) commentId: string,
        @Body("content", NotEmptyStringValidationPipe) content: string,
    ) {}

    @Patch("/update/comment/fixed/:id")
    updateCommentPinStatus(
        @GetUser() user: User,
        @Param("id", UUIDValidationPipe) commentId: string,
        @Body("pinned", BooleanValidationPipe) pinned: boolean,
    ) {}

    @Delete("/delete/comment/:id")
    deleteComment(@GetUser() user: User, @Param("id", UUIDValidationPipe) commentId: string) {}

    @Delete("/delete/:id")
    deleteTask(@GetUser() user: User, @Param("id", UUIDValidationPipe) taskId: string) {}
}
