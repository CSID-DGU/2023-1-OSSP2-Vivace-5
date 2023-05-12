import { TaskService } from "./task.service";
import { User } from "src/entity/user.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { AppendTaskDto } from "./dto/append-task.dto";
import { BringDownDto } from "./dto/bring-down.dto";
export declare class TaskController {
    private taskService;
    constructor(taskService: TaskService);
    getTaskInfo(user: User, taskId: string): void;
    createTask(user: User, createTaskDto: CreateTaskDto): void;
    appendBefore(user: User, appendTaskDto: AppendTaskDto): void;
    appendAfter(user: User, appendTaskDto: AppendTaskDto): void;
    bringDown(user: User, bringDownDto: BringDownDto): void;
    bringUp(user: User, taskId: string): void;
    updateTitle(user: User, taskId: string, newTitle: string): void;
    updateDescription(user: User, taskId: string, newDescription: string): void;
    addToBookmark(): void;
    deleteFromBookmark(): void;
    updateMilestoneStatue(): void;
    updateFinishedStatue(): void;
    delete(): void;
}
