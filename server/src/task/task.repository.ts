import { CustomRepository } from "src/typeorm/typeorm-ex.decorator";
import { TreeRepository } from "typeorm";
import { Project } from "../entity/project.entity";
import { Task } from "src/entity/task.entity";

@CustomRepository(Project)
export class TaskRepository extends TreeRepository<Task> {}
