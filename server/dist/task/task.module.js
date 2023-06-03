"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModule = void 0;
const common_1 = require("@nestjs/common");
const task_controller_1 = require("./task.controller");
const task_service_1 = require("./task.service");
const typeorm_ex_module_1 = require("../typeorm/typeorm-ex.module");
const task_repository_1 = require("./task.repository");
const user_module_1 = require("../user/user.module");
const project_repository_1 = require("../project/project.repository");
const user_repository_1 = require("../user/user.repository");
const bookmark_repository_1 = require("./bookmark.repository");
let TaskModule = class TaskModule {
};
TaskModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_ex_module_1.TypeOrmExModule.forCustomRepository([task_repository_1.TaskRepository, project_repository_1.ProjectRepository, user_repository_1.UserRepository, bookmark_repository_1.BookmarkRepository]),
            user_module_1.UserModule,
        ],
        controllers: [task_controller_1.TaskController],
        providers: [task_service_1.TaskService],
        exports: [],
    })
], TaskModule);
exports.TaskModule = TaskModule;
//# sourceMappingURL=task.module.js.map