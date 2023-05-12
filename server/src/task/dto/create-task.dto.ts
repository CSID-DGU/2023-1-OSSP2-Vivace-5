import { SubTask } from "src/enum/sub-task.enum";

export class CreateTaskDto {
    projectId: string;
    parentId: string;
    title: string;
    description: string;
    type: SubTask;
    start: Date;
    deadline: Date;
    predecessorId: string;
    successorId: string;
}
