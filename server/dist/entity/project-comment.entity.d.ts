import { BaseEntity } from "typeorm";
import { Project } from "./project.entity";
import { User } from "./user.entity";
export declare class ProjectComment extends BaseEntity {
    id: string;
    createdAt: Date;
    modifiedAt: Date;
    content: string;
    pinned: boolean;
    isDeleted: boolean;
    parent: ProjectComment;
    children: ProjectComment[];
    user: User;
    projectId: string;
    project: Project;
}
