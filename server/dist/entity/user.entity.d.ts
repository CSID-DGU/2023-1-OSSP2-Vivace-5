import { UserToProject } from "src/entity/user-to-project.entity";
import { BaseEntity } from "typeorm";
import { ProjectComment } from "./project-comment.entity";
import { Task } from "./task.entity";
import { Bookmark } from "./bookmark.entity";
import { TaskComment } from "./task-comment.entity";
import { UserToTask } from "./user-to-task.entity";
export declare class User extends BaseEntity {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    year: number;
    month: number;
    date: number;
    password: string;
    belong: string;
    country: string;
    region: string;
    encodedImg: string;
    createdAt: Date;
    userToProjects: UserToProject[];
    tasks: Task[];
    projectComments: ProjectComment[];
    taskComments: TaskComment[];
    bookmarks: Bookmark[];
    userToTasks: UserToTask[];
}
