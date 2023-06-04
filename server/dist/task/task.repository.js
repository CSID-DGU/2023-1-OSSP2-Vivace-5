"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const typeorm_ex_decorator_1 = require("../typeorm/typeorm-ex.decorator");
const typeorm_1 = require("typeorm");
const task_entity_1 = require("../entity/task.entity");
const common_1 = require("@nestjs/common");
const user_right_enum_1 = require("../enum/user-right.enum");
let TaskRepository = class TaskRepository extends typeorm_1.TreeRepository {
    async getTaskforUpdate(user, taskId) {
        const taskQuery = this.createQueryBuilder("task");
        taskQuery
            .leftJoinAndSelect("task.project", "project")
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .where("task.id = :taskId", { taskId });
        const found = await taskQuery.getOne();
        if (!found) {
            throw new common_1.NotFoundException(`The task with id ${taskId} is not found.`);
        }
        if (!found.project.userToProjects[0]) {
            throw new common_1.UnauthorizedException(`The user ${user.email} is not member of this project with id ${found.project.id}`);
        }
        if (found.project.userToProjects[0].right === user_right_enum_1.UserRight.MEMBER_MGT ||
            found.project.userToProjects[0].right === user_right_enum_1.UserRight.COMPLETION_MOD) {
            throw new common_1.UnauthorizedException(`The user ${user.email} has insufficient permission for updating task in this project with id ${found.project.id}`);
        }
        return found;
    }
};
TaskRepository = __decorate([
    (0, typeorm_ex_decorator_1.CustomRepository)(task_entity_1.Task)
], TaskRepository);
exports.TaskRepository = TaskRepository;
//# sourceMappingURL=task.repository.js.map