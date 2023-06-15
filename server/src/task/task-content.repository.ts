import { CustomRepository } from "src/typeorm/typeorm-ex.decorator";
import { TaskContent } from "src/entity/task-content.entity";
import { Repository } from "typeorm";

@CustomRepository(TaskContent)
export class TaskContentRepository extends Repository<TaskContent> {}
