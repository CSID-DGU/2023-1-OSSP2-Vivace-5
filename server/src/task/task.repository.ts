import { CustomRepository } from "src/typeorm/typeorm-ex.decorator";
import { TreeRepository } from "typeorm";
import { Task } from "src/entity/task.entity";
import { User } from "src/entity/user.entity";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserRight } from "src/enum/user-right.enum";

@CustomRepository(Task)
export class TaskRepository extends TreeRepository<Task> {
    async getTaskforUpdate(user: User, taskId: string): Promise<Task> {
        const taskQuery = this.createQueryBuilder("task");

        taskQuery
            .leftJoinAndSelect("task.project", "project")
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
                userId: user.id,
            })
            .where("task.id = :taskId", { taskId });

        const found: Task = await taskQuery.getOne();

        if (!found) {
            throw new NotFoundException(`The task with id ${taskId} is not found.`);
        }

        if (!found.project.userToProjects[0]) {
            throw new UnauthorizedException(
                `The user ${user.email} is not member of this project with id ${found.project.id}`,
            );
        }

        if (
            found.project.userToProjects[0].right === UserRight.MEMBER_MGT ||
            found.project.userToProjects[0].right === UserRight.COMPLETION_MOD
        ) {
            throw new UnauthorizedException(
                `The user ${user.email} has insufficient permission for updating task in this project with id ${found.project.id}`,
            );
        }

        return found;
    }
}
