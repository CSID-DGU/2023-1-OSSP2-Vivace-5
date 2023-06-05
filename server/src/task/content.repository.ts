import { TaskContent } from "src/entity/task-content.entity";
import { CustomRepository } from "src/typeorm/typeorm-ex.decorator";
import { Repository } from "typeorm";

@CustomRepository(TaskContent)
export class TaskContentRepository extends Repository<TaskContent> {}