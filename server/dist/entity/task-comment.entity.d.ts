import { BaseEntity } from "typeorm";
import { User } from "./user.entity";
import { Task } from "./task.entity";
export declare class TaskComment extends BaseEntity {
    id: string;
    createdAt: Date;
    modifiedAt: Date;
    content: string;
    pinned: boolean;
    parent: TaskComment;
    children: TaskComment[];
    user: User;
    task: Task;
}
