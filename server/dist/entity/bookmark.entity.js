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
exports.Bookmark = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const task_entity_1 = require("./task.entity");
const project_entity_1 = require("./project.entity");
let Bookmark = class Bookmark extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Bookmark.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bookmark.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "userId" }),
    __metadata("design:type", String)
], Bookmark.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => user_entity_1.User, (user) => user.bookmarks, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: "userId" }),
    __metadata("design:type", user_entity_1.User)
], Bookmark.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "taskId", nullable: true }),
    __metadata("design:type", String)
], Bookmark.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => task_entity_1.Task, (task) => task.bookmarks, { eager: false, onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "taskId" }),
    __metadata("design:type", task_entity_1.Task)
], Bookmark.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "projectId" }),
    __metadata("design:type", String)
], Bookmark.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => project_entity_1.Project, (project) => project.bookmarks, { eager: false, onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "projectId" }),
    __metadata("design:type", project_entity_1.Project)
], Bookmark.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.TreeParent)({ onDelete: "CASCADE" }),
    __metadata("design:type", Bookmark)
], Bookmark.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.TreeChildren)(),
    __metadata("design:type", Array)
], Bookmark.prototype, "children", void 0);
Bookmark = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Tree)("closure-table")
], Bookmark);
exports.Bookmark = Bookmark;
//# sourceMappingURL=bookmark.entity.js.map