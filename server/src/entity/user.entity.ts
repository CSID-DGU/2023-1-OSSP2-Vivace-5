import { UserToProject } from "src/entity/user-to-project.entity";
import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ProjectComment } from "./project-comment.entity";
import { Task } from "./task.entity";
import { Bookmark } from "./bookmark.entity";
import { TaskComment } from "./task-comment.entity";
import { UserToTask } from "./user-to-task.entity";

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

    @ManyToMany((type) => Task, (tasks) => tasks.members, { eager: false })
    tasks: Task[];

    @OneToMany((type) => ProjectComment, (projectComments) => projectComments.user, { eager: false })
    projectComments: ProjectComment[];

    @OneToMany((type) => TaskComment, (taskComments) => taskComments.user, { eager: false })
    taskComments: TaskComment[];

    @OneToMany((type) => Bookmark, (bookmarks) => bookmarks.user, { eager: false })
    bookmarks: Bookmark[];

    @OneToMany((type) => UserToTask, (userToTask) => userToTask.task, { eager: false })
    userToTasks: UserToTask[];
}
