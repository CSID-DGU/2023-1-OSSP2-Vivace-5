import { TreeRepository } from "typeorm";
import { Task } from "src/entity/task.entity";
import { User } from "src/entity/user.entity";
export declare class TaskRepository extends TreeRepository<Task> {
    getTaskforUpdate(user: User, taskId: string): Promise<Task>;
}
