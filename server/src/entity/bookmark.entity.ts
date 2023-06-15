import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
} from "typeorm";
import { User } from "./user.entity";
import { Task } from "./task.entity";
import { Project } from "./project.entity";

@Entity()
@Tree("closure-table")
export class Bookmark extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column({ name: "userId" })
    userId: string;

    @ManyToOne((type) => User, (user) => user.bookmarks, { eager: false })
    @JoinColumn({ name: "userId" })
    user: User;

    @Column({ name: "taskId", nullable: true })
    taskId: string;

    @ManyToOne((type) => Task, (task) => task.bookmarks, { eager: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "taskId" })
    task: Task;

    @Column({ name: "projectId" })
    projectId: string;

    @ManyToOne((type) => Project, (project) => project.bookmarks, { eager: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "projectId" })
    project: Project;

    @TreeParent({ onDelete: "CASCADE" })
    parent: Bookmark;

    @TreeChildren()
    children: Bookmark[];
}
