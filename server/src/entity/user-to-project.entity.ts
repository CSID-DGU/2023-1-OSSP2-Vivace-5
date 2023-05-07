import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.entity";
import { User } from "src/entity/user.entity";
import { UserRight } from "../enum/user-right.enum";

@Entity()
export class UserToProject extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    userRight: UserRight;

    @ManyToOne((type) => Project, (project) => project.userToProjects, { eager: false })
    project: Project;

    @ManyToOne((type) => User, (user) => user.userToProjects, { eager: false })
    user: User;
}
