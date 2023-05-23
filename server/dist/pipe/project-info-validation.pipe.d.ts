import { PipeTransform } from "@nestjs/common";
import { UserRight } from "../enum/user-right.enum";
import { SubTask } from "../enum/sub-task.enum";
export declare class ProjectInfoValidationPipe implements PipeTransform {
    readonly RightOptions: UserRight[];
    readonly SubTaskTypeOptinos: SubTask[];
    transform(value: any): any;
    private isValidRight;
    private isValidType;
}
