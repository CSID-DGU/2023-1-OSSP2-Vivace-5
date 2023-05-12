import { CustomRepository } from "src/typeorm/typeorm-ex.decorator";
import { TreeRepository } from "typeorm";
import { Project } from "../entity/project.entity";
import { Task } from "src/entity/task.entity";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@CustomRepository(Project)
export class TaskRepository extends TreeRepository<Task> {}
