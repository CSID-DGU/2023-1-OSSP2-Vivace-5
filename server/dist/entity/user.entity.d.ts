import { UserToProject } from "src/entity/user-to-project.entity";
import { UserToTask } from "src/entity/user-to-task.entity";
import { BaseEntity } from "typeorm";
import { ProjectComment } from "./project-comment.entity";
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
    userToTasks: UserToTask[];
    projectComments: ProjectComment[];
}
