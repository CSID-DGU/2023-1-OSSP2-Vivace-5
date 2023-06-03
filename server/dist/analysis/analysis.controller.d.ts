import { AnalysisService } from "./analysis.service";
import { User } from "src/entity/user.entity";
import { Task } from "src/entity/task.entity";
import { Relation } from "src/enum/relation.enum";
export declare class AnalysisController {
    private analysisService;
    private logger;
    constructor(analysisService: AnalysisService);
    getRootTodo(user: User, projectId: string): Promise<{
        todo: Task[];
        cycles: Set<Task>[];
    }>;
    getTodo(user: User, parentId: string): Promise<{
        todo: Task[];
        cycles: Set<Task>[];
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
}
