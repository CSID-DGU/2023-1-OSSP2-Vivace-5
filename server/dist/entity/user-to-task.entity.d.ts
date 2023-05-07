import { Task } from "src/entity/task.entity";
import { User } from "src/entity/user.entity";
import { BaseEntity } from "typeorm";
export declare class UserToTask extends BaseEntity {
    id: string;
    bookmark: boolean;
    user: User;
    task: Task;
}
