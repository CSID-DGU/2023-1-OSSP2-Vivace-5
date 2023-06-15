import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./task.entity";

@Entity()
export class TaskContent extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    createdAt: Date;

    @Column()
    modifiedAt: Date;

    @Column()
    content: string;

    @Column({ name: "taskId" })
    taskId: string;

    @ManyToOne((type) => Task, (task) => task.contents, { eager: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "taskId" })
    task: Task;
}
