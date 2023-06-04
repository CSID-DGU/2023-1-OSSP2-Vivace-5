import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Task } from "./task.entity";
import { Project } from "./project.entity";

@Entity()
export class KanbanColumn extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @OneToOne((type) => KanbanColumn, (predecessor) => predecessor.successor, { eager: false })
    @JoinColumn({ name: "predecessorId" })
    predecessor: KanbanColumn;

    @OneToOne((type) => KanbanColumn, (successor) => successor.predecessor, { eager: false })
    @JoinColumn({ name: "successorId" })
    successor: KanbanColumn;

    @Column({ name: "parentId" })
    parentId: string;

    @ManyToOne((type) => Task, (task) => task.childColumns, { eager: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "parentId" })
    parent: Task;

    @OneToMany((type) => Task, (task) => task.parentColumn, { eager: false })
    children: Task[];

    @Column({ name: "projectId" })
    projectId: string;

    @ManyToOne(() => Project, (project) => project.columns, { eager: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "projectId" })
    project: Project;
}
