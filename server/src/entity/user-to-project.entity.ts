import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.entity";
import { User } from "src/entity/user.entity";
import { UserRight } from "../enum/user-right.enum";

@Entity()
export class UserToProject extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    right: UserRight;

    @Column({ name: "projectId" })
    projectId: string;

    @Column({ name: "userId" })
    userId: string;

    @ManyToOne((type) => Project, (project) => project.userToProjects, { eager: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "projectId" })
    project: Project;

    @ManyToOne((type) => User, (user) => user.userToProjects, { eager: false })
    @JoinColumn({ name: "userId" })
    user: User;
}
