import { SubTask } from "src/enum/sub-task.enum";
export declare class CreateTaskDto {
    projectId: string;
    parentId: string;
    isKanban: boolean;
    title: string;
    description: string;
    type: SubTask;
    start: Date;
    deadline: Date;
}
