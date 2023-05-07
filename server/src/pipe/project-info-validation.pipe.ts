import { BadRequestException, PipeTransform } from "@nestjs/common";
import { UserRight } from "../enum/user-right.enum";
import { SubTask } from "../enum/sub-task.enum";

export class ProjectInfoValidationPipe implements PipeTransform {
    readonly RightOptions = [
        UserRight.ADMIN,
        UserRight.MEMBER_AND_TASK_MGT,
        UserRight.MEMBER_MGT,
        UserRight.TASK_MGT,
        UserRight.COMPLETION_MOD,
    ];

    readonly SubTaskTypeOptinos = [SubTask.GRAPH, SubTask.KANBAN, SubTask.LIST, SubTask.TERMINAL];

    transform(value: any) {
        value.type = value.type.toUpperCase();

        if (!this.isValidType(value.type)) {
            throw new BadRequestException(`Project type ${value.type} isn't a valid sub-task type.`);
        }

        if (!value.members) {
            return value;
        }

        value.members.forEach((element: any) => {
            element.right = element.right.toUpperCase();

            if (!this.isValidRight(element.right)) {
                throw new BadRequestException(`User right ${element.right} of ${element.id} isn't a valid right.`);
            }
        });

        return value;
    }

    private isValidRight(right: any) {
        const index = this.RightOptions.indexOf(right);

        return index !== -1;
    }

    private isValidType(type: any) {
        const index = this.SubTaskTypeOptinos.indexOf(type);

        return index !== -1;
    }
}
