import { BaseEntity } from "typeorm";
import { Task } from "./task.entity";
export declare class TaskContent extends BaseEntity {
    id: string;
    content: string[];
    task: Task;
}
