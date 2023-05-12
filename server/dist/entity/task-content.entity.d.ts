import { BaseEntity } from "typeorm";
import { Task } from "./task.entity";
export declare class TaskContent extends BaseEntity {
    id: string;
    title: string;
    createdAt: Date;
    modifiedAt: Date;
    content: string;
    task: Task;
}
