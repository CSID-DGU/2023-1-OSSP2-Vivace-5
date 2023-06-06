import { BaseEntity } from "typeorm";
import { User } from "src/entity/user.entity";
import { Task } from "./task.entity";
export declare class UserToTask extends BaseEntity {
    id: string;
    bookmark: boolean;
    userId: string;
    taskId: string;
    task: Task;
    user: User;
}
