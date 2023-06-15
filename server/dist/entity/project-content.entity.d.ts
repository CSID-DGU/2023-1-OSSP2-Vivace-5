import { BaseEntity } from "typeorm";
import { Project } from "./project.entity";
export declare class ProjectContent extends BaseEntity {
    id: string;
    title: string;
    createdAt: Date;
    modifiedAt: Date;
    content: string;
    project: Project;
}
