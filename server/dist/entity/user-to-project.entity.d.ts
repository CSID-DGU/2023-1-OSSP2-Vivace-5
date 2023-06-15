import { BaseEntity } from "typeorm";
import { Project } from "./project.entity";
import { User } from "src/entity/user.entity";
import { UserRight } from "../enum/user-right.enum";
export declare class UserToProject extends BaseEntity {
    id: number;
    right: UserRight;
    isBookmarked: boolean;
    projectId: string;
    userId: string;
    project: Project;
    user: User;
}
