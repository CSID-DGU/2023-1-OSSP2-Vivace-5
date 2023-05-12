import { Body, Controller, Delete, Get, Patch, Post, UseGuards, ValidationPipe } from "@nestjs/common";
import { TaskService } from "./task.service";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/user/get-user.decorator";
import { User } from "src/entity/user.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { AppendTaskDto } from "./dto/append-task.dto";
import { BringDownDto } from "./dto/bring-down.dto";

@Controller("task")
@UseGuards(AuthGuard())
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Get("/")
    getAllTasks() {}

    @Post("/create")
    createTask(@GetUser() user: User, @Body(ValidationPipe) createTaskDto: CreateTaskDto) {}

    @Patch("/append/before")
    appendBefore(@GetUser() user: User, @Body(ValidationPipe) appendTaskDto: AppendTaskDto) {}

    @Patch("/append/after")
    appendAfter(@GetUser() user: User, @Body(ValidationPipe) appendTaskDto: AppendTaskDto) {}

    @Patch("/bring/down")
    bringDown(@GetUser() user: User, @Body(ValidationPipe) bringDownDto: BringDownDto) {}

    @Patch("/bring/up")
    bringUp(@GetUser() user: User, @Body("taskId") taskId: string) {}

    @Patch("/update/info")
    updateInfo() {}

    @Patch("/update/content")
    updateContent() {} // Update md content of terminal

    @Patch("/add/bookmark")
    addToBookmark() {}

    @Patch("/add/bookmark")
    deleteFromBookmark() {}

    @Patch("/update/milstone")
    updateMilestoneStatue() {}

    @Patch("/update/finished")
    updateFinishedStatue() {}

    // addComment()

    // addReply()

    // deleteComment()

    // getAllComments()

    @Delete("delete")
    delete() {}
}
