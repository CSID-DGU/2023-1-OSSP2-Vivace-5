import { CustomRepository } from "src/typeorm/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { KanbanColumn } from "src/entity/kanban-column.entity";

@CustomRepository(KanbanColumn)
export class KanbanColumnRepository extends Repository<KanbanColumn> {}
