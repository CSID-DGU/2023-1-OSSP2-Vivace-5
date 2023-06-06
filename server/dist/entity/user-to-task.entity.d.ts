import { BaseEntity } from "typeorm";
import { User } from "src/entity/user.entity";
import { Task } from "./task.entity";
export declare class UserToTask extends BaseEntity {
    id: string;
    bookmark: boolean;
    taskId: string;
    task: Task;
    userId: string;
    user: User;
}
