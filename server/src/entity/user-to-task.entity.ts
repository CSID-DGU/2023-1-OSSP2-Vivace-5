import { Task } from "src/entity/task.entity";
import { User } from "src/entity/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserToTask extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    bookmark: boolean;

    @ManyToOne((type) => User, (user) => user.userToTasks, { eager: false })
    user: User;

    @ManyToOne((type) => Task, (task) => task.userToTasks, { eager: false })
    task: Task;
}
