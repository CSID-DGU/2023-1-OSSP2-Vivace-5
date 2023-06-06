import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.entity";
import { User } from "src/entity/user.entity";
import { UserRight } from "../enum/user-right.enum";
import { Task } from "./task.entity";

@Entity()
export class UserToTask extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    bookmark: boolean;

    @Column({ name: "userId" })
    userId: string;

    @Column({ name: "taskId" })
    taskId: string;

    @ManyToOne((type) => Task, (task) => task.userToTasks, { eager: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "taskId" })
    task: Task;

    @ManyToOne((type) => User, (user) => user.userToProjects, { eager: false })
    @JoinColumn({ name: "userId" })
    user: User;
}
