import { Project } from "src/entity/project.entity";
import { SubTask } from "src/enum/sub-task.enum";
import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
} from "typeorm";
import { KanbanColumn } from "./kanban-column.entity";
import { TaskContent } from "./task-content.entity";
import { User } from "./user.entity";
import { Bookmark } from "./bookmark.entity";
import { TaskComment } from "./task-comment.entity";

@Entity()
@Tree("closure-table", {
    closureTableName: "task_closure",
})
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    type: SubTask;

    @Column()
    mailstone: boolean;

    @Column()
    createdAt: Date;

    @Column()
    modifiedAt: Date;

    @Column()
    start: Date;

    @Column()
    end: Date;

    @Column()
    deadline: Date;

    @Column()
    isFinished: boolean;

    @OneToMany((type) => KanbanColumn, (childColumns) => childColumns.parent, { eager: false })
    childColumns: KanbanColumn[];

    @ManyToOne((type) => KanbanColumn, (parentColumn) => parentColumn.children, { eager: false })
    parentColumn: KanbanColumn;

    @TreeParent()
    parent: Task;

    @TreeChildren()
    children: Task[];

    @OneToMany((type) => Task, (task) => task.successors, { eager: false })
    predecessors: Task[];

    @OneToMany((type) => Task, (task) => task.predecessors, { eager: false })
    successors: Task[];

    @Column({ name: "projectId" })
    projectId: string;

    @ManyToOne((type) => Project, (project) => project.tasks, { eager: false })
    @JoinColumn({ name: "projectId" })
    project: Project;

    @ManyToMany((type) => User, (members) => members.tasks, { eager: false })
    @JoinTable()
    members: User[];

    @OneToMany((type) => TaskContent, (contents) => contents.task, { eager: false })
    contents: TaskContent[];

    @OneToMany((type) => Bookmark, (bookmarks) => bookmarks.task, { eager: false })
    bookmarks: Bookmark[];

    @OneToMany((type) => TaskComment, (comments) => comments.task, { eager: false })
    comments: TaskComment[];
}
