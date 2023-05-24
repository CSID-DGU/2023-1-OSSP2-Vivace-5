import { BaseEntity } from "typeorm";
import { User } from "./user.entity";
import { Task } from "./task.entity";
export declare class Bookmark extends BaseEntity {
    id: string;
    title: string;
    userId: string;
    user: User;
    task: Task;
    parent: Bookmark;
    children: Bookmark[];
}
