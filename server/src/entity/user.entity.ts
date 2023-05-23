import { UserToProject } from "src/entity/user-to-project.entity";
import { UserToTask } from "src/entity/user-to-task.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ProjectComment } from "./project-comment.entity";

@Entity()
@Unique(["email"])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    year: number;

    @Column()
    month: number;

    @Column()
    date: number;

    @Column()
    password: string;

    @Column()
    belong: string;

    @Column()
    country: string;

    @Column()
    region: string;

    @Column()
    encodedImg: string;

    @Column()
    createdAt: Date;

    @OneToMany((type) => UserToProject, (userToProject) => userToProject.user, { eager: false })
    userToProjects: UserToProject[];

    @OneToMany((type) => UserToTask, (userToTask) => userToTask.user, { eager: false })
    userToTasks: UserToTask[];

    @OneToMany((type) => ProjectComment, (projectComments) => projectComments.user, { eager: false })
    projectComments: ProjectComment[];
}
