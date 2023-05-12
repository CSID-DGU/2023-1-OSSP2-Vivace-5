import { Project } from "src/entity/project.entity";
import { SubTask } from "src/enum/sub-task.enum";
import { UserToTask } from "src/entity/user-to-task.entity";
import { BaseEntity } from "typeorm";
import { KanbanColumn } from "./kanban-column.entity";
export declare class Task extends BaseEntity {
    id: string;
    title: string;
    description: string;
    type: SubTask;
    filePath: string;
    mailstone: boolean;
    createdAt: Date;
    modifiedAt: Date;
    start: Date;
    end: Date;
    deadline: Date;
    isFinished: boolean;
    childColumns: KanbanColumn[];
    parentColumn: KanbanColumn;
    parent: Task;
    children: Task[];
    predecessors: Task[];
    successors: Task[];
    projectId: string;
    project: Project;
    userToTasks: UserToTask[];
}
