import { BaseEntity } from "typeorm";
import { Task } from "./task.entity";
export declare class KanbanColumn extends BaseEntity {
    id: string;
    title: string;
    predecessor: KanbanColumn;
    successor: KanbanColumn;
    parent: Task;
    children: Task[];
}
