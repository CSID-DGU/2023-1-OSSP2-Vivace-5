"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectInfoValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const user_right_enum_1 = require("../enum/user-right.enum");
const sub_task_enum_1 = require("../enum/sub-task.enum");
class ProjectInfoValidationPipe {
    constructor() {
        this.RightOptions = [
            user_right_enum_1.UserRight.ADMIN,
            user_right_enum_1.UserRight.MEMBER_AND_TASK_MGT,
            user_right_enum_1.UserRight.MEMBER_MGT,
            user_right_enum_1.UserRight.TASK_MGT,
            user_right_enum_1.UserRight.COMPLETION_MOD,
        ];
        this.SubTaskTypeOptinos = [sub_task_enum_1.SubTask.GRAPH, sub_task_enum_1.SubTask.KANBAN, sub_task_enum_1.SubTask.LIST, sub_task_enum_1.SubTask.TERMINAL];
    }
    transform(value) {
        value.type = value.type.toUpperCase();
        if (!this.isValidType(value.type)) {
            throw new common_1.BadRequestException(`Project type ${value.type} isn't a valid sub-task type.`);
        }
        if (!value.members) {
            return value;
        }
        value.members.forEach((element) => {
            element.right = element.right.toUpperCase();
            if (!this.isValidRight(element.right)) {
                throw new common_1.BadRequestException(`User right ${element.right} of ${element.id} isn't a valid right.`);
            }
        });
        return value;
    }
    isValidRight(right) {
        const index = this.RightOptions.indexOf(right);
        return index !== -1;
    }
    isValidType(type) {
        const index = this.SubTaskTypeOptinos.indexOf(type);
        return index !== -1;
    }
}
exports.ProjectInfoValidationPipe = ProjectInfoValidationPipe;
//# sourceMappingURL=project-info-validation.pipe.js.map