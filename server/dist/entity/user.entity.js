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
exports.User = void 0;
const user_to_project_entity_1 = require("./user-to-project.entity");
const typeorm_1 = require("typeorm");
const project_comment_entity_1 = require("./project-comment.entity");
const task_entity_1 = require("./task.entity");
const bookmark_entity_1 = require("./bookmark.entity");
const task_comment_entity_1 = require("./task-comment.entity");
let User = class User extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], User.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], User.prototype, "month", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], User.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "belong", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "encodedImg", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => user_to_project_entity_1.UserToProject, (userToProject) => userToProject.user, { eager: false }),
    __metadata("design:type", Array)
], User.prototype, "userToProjects", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)((type) => task_entity_1.Task, (tasks) => tasks.members, { eager: false }),
    __metadata("design:type", Array)
], User.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => project_comment_entity_1.ProjectComment, (projectComments) => projectComments.user, { eager: false }),
    __metadata("design:type", Array)
], User.prototype, "projectComments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => task_comment_entity_1.TaskComment, (taskComments) => taskComments.user, { eager: false }),
    __metadata("design:type", Array)
], User.prototype, "taskComments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => bookmark_entity_1.Bookmark, (bookmarks) => bookmarks.user, { eager: false }),
    __metadata("design:type", Array)
], User.prototype, "bookmarks", void 0);
User = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(["email"])
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map