import { BaseEntity } from "typeorm";
import { Task } from "./task.entity";
import { Project } from "./project.entity";
export declare class KanbanColumn extends BaseEntity {
    id: string;
    title: string;
    predecessor: KanbanColumn;
    successor: KanbanColumn;
    parent: Task;
    children: Task[];
    project: Project;
}
