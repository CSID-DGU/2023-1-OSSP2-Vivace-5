"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const common_1 = require("@nestjs/common");
const task_service_1 = require("./task.service");
const passport_1 = require("@nestjs/passport");
const get_user_decorator_1 = require("../user/get-user.decorator");
const user_entity_1 = require("../entity/user.entity");
const create_task_dto_1 = require("./dto/create-task.dto");
const append_task_dto_1 = require("./dto/append-task.dto");
const bring_down_dto_1 = require("./dto/bring-down.dto");
let TaskController = class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
    }
    getTaskInfo(user, taskId) { }
    createTask(user, createTaskDto) { }
    appendBefore(user, appendTaskDto) { }
    appendAfter(user, appendTaskDto) { }
    bringDown(user, bringDownDto) { }
    bringUp(user, taskId) { }
    updateTitle(user, taskId, newTitle) { }
    updateDescription(user, taskId, newDescription) { }
    addToBookmark() { }
    deleteFromBookmark() { }
    updateMilestoneStatue() { }
    updateFinishedStatue() { }
    delete() { }
};
__decorate([
    (0, common_1.Get)("/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "getTaskInfo", null);
__decorate([
    (0, common_1.Post)("/create"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, create_task_dto_1.CreateTaskDto]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "createTask", null);
__decorate([
    (0, common_1.Patch)("/append/before"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, append_task_dto_1.AppendTaskDto]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "appendBefore", null);
__decorate([
    (0, common_1.Patch)("/append/after"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, append_task_dto_1.AppendTaskDto]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "appendAfter", null);
__decorate([
    (0, common_1.Patch)("/bring/down"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, bring_down_dto_1.BringDownDto]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "bringDown", null);
__decorate([
    (0, common_1.Patch)("/bring/up"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)("taskId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "bringUp", null);
__decorate([
    (0, common_1.Patch)("/update/title/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)("newTitle")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateTitle", null);
__decorate([
    (0, common_1.Patch)("/update/description/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)("newDescription")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateDescription", null);
__decorate([
    (0, common_1.Patch)(),
    (0, common_1.Patch)("/add/bookmark"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "addToBookmark", null);
__decorate([
    (0, common_1.Patch)("/add/bookmark"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "deleteFromBookmark", null);
__decorate([
    (0, common_1.Patch)("/update/milstone"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateMilestoneStatue", null);
__decorate([
    (0, common_1.Patch)("/update/finished"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "updateFinishedStatue", null);
__decorate([
    (0, common_1.Delete)("delete"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaskController.prototype, "delete", null);
TaskController = __decorate([
    (0, common_1.Controller)("task"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __metadata("design:paramtypes", [task_service_1.TaskService])
], TaskController);
exports.TaskController = TaskController;
//# sourceMappingURL=task.controller.js.map