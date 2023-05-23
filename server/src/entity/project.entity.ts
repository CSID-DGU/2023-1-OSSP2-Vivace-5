import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SubTask } from "../enum/sub-task.enum";
import { UserToProject } from "./user-to-project.entity";
import { Task } from "src/entity/task.entity";
import { ProjectComment } from "./project-comment.entity";

@Entity()
export class Project extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    type: SubTask;

    @Column()
    encodedImg: string;

    @Column()
    createdAt: Date;

    @OneToMany((type) => Task, (task) => task.project, { eager: false })
    tasks: Task[];

    @OneToMany((type) => ProjectComment, (comments) => comments.project, { eager: false })
    comments: ProjectComment[];

    @OneToMany((type) => UserToProject, (userToProject) => userToProject.project, { eager: false })
    userToProjects: UserToProject[];
}
