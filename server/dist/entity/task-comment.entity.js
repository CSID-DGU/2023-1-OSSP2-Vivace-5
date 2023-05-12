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
exports.TaskComment = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const task_entity_1 = require("./task.entity");
let TaskComment = class TaskComment extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], TaskComment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], TaskComment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], TaskComment.prototype, "modifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TaskComment.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], TaskComment.prototype, "pinned", void 0);
__decorate([
    (0, typeorm_1.TreeParent)(),
    __metadata("design:type", TaskComment)
], TaskComment.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.TreeChildren)(),
    __metadata("design:type", Array)
], TaskComment.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => user_entity_1.User, (user) => user.taskComments, { eager: false }),
    __metadata("design:type", user_entity_1.User)
], TaskComment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => task_entity_1.Task, (task) => task.comments, { eager: false }),
    __metadata("design:type", task_entity_1.Task)
], TaskComment.prototype, "task", void 0);
TaskComment = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Tree)("closure-table", {
        closureTableName: "task_comment_closure",
    })
], TaskComment);
exports.TaskComment = TaskComment;
//# sourceMappingURL=task-comment.entity.js.map