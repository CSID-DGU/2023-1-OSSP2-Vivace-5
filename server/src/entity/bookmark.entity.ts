import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from "typeorm";
import { User } from "./user.entity";
import { Task } from "./task.entity";

@Entity()
@Tree("closure-table", {
    closureTableName: "bookmark_closure",
})
export class Bookmark extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @ManyToOne((type) => User, (user) => user.bookmarks, { eager: false })
    user: User;

    @ManyToOne((type) => Task, (task) => task.bookmarks, { eager: false })
    task: Task;

    @TreeParent()
    parent: Bookmark;

    @TreeChildren()
    children: Bookmark[];
}
