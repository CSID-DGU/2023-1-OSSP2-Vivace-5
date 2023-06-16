import { Task } from "src/entity/task.entity";
import { User } from "src/entity/user.entity";
import { Relation } from "src/enum/relation.enum";
import { ProjectRepository } from "src/project/project.repository";
import { TaskRepository } from "src/task/task.repository";
export declare class AnalysisService {
    private taskRepository;
    private projectRepository;
    constructor(taskRepository: TaskRepository, projectRepository: ProjectRepository);
    getRootTodo(user: User, projectId: string): Promise<{
        todo: Task[];
    }>;
    getTodo(user: User, parentId: string): Promise<{
        todo: Task[];
    }>;
    getRelation(user: User, firstTaskId: string, secondTaskId: string): Promise<{
        relation: Relation;
    }>;
    getMemberTasksInRoot(user: User, projectId: string, memberId: string): Promise<{
        myTasks: Task[];
        yourTasks: Task[];
        intersection: Task[];
    }>;
    getMemberTasks(user: User, parentId: string, memberId: string): Promise<{
        myTasks: Task[];
        yourTasks: Task[];
        intersection: Task[];
    }>;
    private getCycles;
    private postOrderingRecursive;
}
