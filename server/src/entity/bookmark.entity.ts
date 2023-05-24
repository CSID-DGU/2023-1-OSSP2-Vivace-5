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

    @ManyToOne((type) => Task, (task) => task.bookmarks, { eager: false, onDelete: "CASCADE" })
    task: Task;

    @TreeParent()
    parent: Bookmark;

    @TreeChildren()
    children: Bookmark[];
}
