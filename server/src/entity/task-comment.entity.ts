import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from "typeorm";
import { User } from "./user.entity";
import { Task } from "./task.entity";

@Entity()
@Tree("closure-table")
export class TaskComment extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    createdAt: Date;

    @Column()
    modifiedAt: Date;

    @Column()
    content: string;

    @Column()
    pinned: boolean;

    @TreeParent()
    parent: TaskComment;

    @TreeChildren()
    children: TaskComment[];

    @ManyToOne((type) => User, (user) => user.taskComments, { eager: false })
    user: User;

    @ManyToOne((type) => Task, (task) => task.comments, { eager: false, onDelete: "CASCADE" })
    task: Task;
}
