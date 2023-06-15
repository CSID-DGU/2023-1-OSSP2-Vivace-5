import { BaseEntity } from "typeorm";
import { User } from "./user.entity";
import { Task } from "./task.entity";
import { Project } from "./project.entity";
export declare class Bookmark extends BaseEntity {
    id: string;
    title: string;
    userId: string;
    user: User;
    taskId: string;
    task: Task;
    projectId: string;
    project: Project;
    parent: Bookmark;
    children: Bookmark[];
}
