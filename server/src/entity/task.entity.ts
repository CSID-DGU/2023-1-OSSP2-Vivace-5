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
import { UserToTask } from "./user-to-task.entity";

@Entity()
@Tree("closure-table")
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
    milestone: boolean;

    @Column()
    createdAt: Date;

    @Column()
    start: Date;

    @Column({ nullable: true })
    end: Date;

    @Column()
    deadline: Date;

    @Column()
    isFinished: boolean;

    @OneToMany((type) => KanbanColumn, (childColumns) => childColumns.parent, { eager: false })
    childColumns: KanbanColumn[];

    @Column({ name: "parentColumnId", nullable: true })
    parentColumnId: string;

    @ManyToOne((type) => KanbanColumn, (parentColumn) => parentColumn.children, { eager: false })
    @JoinColumn({ name: "parentColumnId" })
    parentColumn: KanbanColumn;

    @TreeParent({ onDelete: "CASCADE" })
    parent: Task;

    @TreeChildren()
    children: Task[];

    @ManyToMany((type) => Task, (task) => task.successors, { eager: false })
    @JoinTable()
    predecessors: Task[];

    @ManyToMany((type) => Task, (task) => task.predecessors, { eager: false })
    successors: Task[];

    @Column({ name: "projectId" })
    projectId: string;

    @ManyToOne((type) => Project, (project) => project.tasks, { eager: false, onDelete: "CASCADE" })
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

    @OneToMany((type) => UserToTask, (userToTask) => userToTask.task, { eager: false })
    userToTasks: UserToTask[];
}
