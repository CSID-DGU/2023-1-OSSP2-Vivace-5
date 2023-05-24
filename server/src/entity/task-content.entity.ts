import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @ManyToOne((type) => Task, (task) => task.contents, { eager: false, onDelete: "CASCADE" })
    task: Task;
}
