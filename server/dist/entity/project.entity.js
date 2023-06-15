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
exports.Project = void 0;
const typeorm_1 = require("typeorm");
const sub_task_enum_1 = require("../enum/sub-task.enum");
const user_to_project_entity_1 = require("./user-to-project.entity");
const task_entity_1 = require("./task.entity");
const project_comment_entity_1 = require("./project-comment.entity");
const kanban_column_entity_1 = require("./kanban-column.entity");
const bookmark_entity_1 = require("./bookmark.entity");
const project_content_entity_1 = require("./project-content.entity");
let Project = class Project extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Project.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project.prototype, "encodedImg", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Project.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => task_entity_1.Task, (task) => task.project, { eager: false }),
    __metadata("design:type", Array)
], Project.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => project_comment_entity_1.ProjectComment, (comments) => comments.project, { eager: false }),
    __metadata("design:type", Array)
], Project.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => user_to_project_entity_1.UserToProject, (userToProject) => userToProject.project, { eager: false }),
    __metadata("design:type", Array)
], Project.prototype, "userToProjects", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => kanban_column_entity_1.KanbanColumn, (column) => column.project, { eager: false }),
    __metadata("design:type", Array)
], Project.prototype, "columns", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => bookmark_entity_1.Bookmark, (bookmark) => bookmark.project, { eager: false }),
    __metadata("design:type", Array)
], Project.prototype, "bookmarks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => project_content_entity_1.ProjectContent, (contents) => contents.project, { eager: false }),
    __metadata("design:type", Array)
], Project.prototype, "contents", void 0);
Project = __decorate([
    (0, typeorm_1.Entity)()
], Project);
exports.Project = Project;
//# sourceMappingURL=project.entity.js.map