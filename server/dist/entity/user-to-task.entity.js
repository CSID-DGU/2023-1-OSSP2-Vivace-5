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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserToTask = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const task_entity_1 = require("./task.entity");
let UserToTask = class UserToTask extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], UserToTask.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], UserToTask.prototype, "bookmark", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "taskId" }),
    __metadata("design:type", String)
], UserToTask.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => task_entity_1.Task, (task) => task.userToTasks, { eager: false, onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "taskId" }),
    __metadata("design:type", task_entity_1.Task)
], UserToTask.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "userId" }),
    __metadata("design:type", String)
], UserToTask.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => user_entity_1.User, (user) => user.userToTasks, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", user_entity_1.User)
], UserToTask.prototype, "user", void 0);
UserToTask = __decorate([
    (0, typeorm_1.Entity)()
], UserToTask);
exports.UserToTask = UserToTask;
//# sourceMappingURL=user-to-task.entity.js.map