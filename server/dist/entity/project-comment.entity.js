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
exports.ProjectComment = void 0;
const typeorm_1 = require("typeorm");
const project_entity_1 = require("./project.entity");
const user_entity_1 = require("./user.entity");
let ProjectComment = class ProjectComment extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], ProjectComment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ProjectComment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ProjectComment.prototype, "modifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProjectComment.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], ProjectComment.prototype, "pinned", void 0);
__decorate([
    (0, typeorm_1.TreeParent)(),
    __metadata("design:type", ProjectComment)
], ProjectComment.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.TreeChildren)(),
    __metadata("design:type", Array)
], ProjectComment.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => user_entity_1.User, (user) => user.projectComments, { eager: false }),
    __metadata("design:type", user_entity_1.User)
], ProjectComment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "projectId" }),
    __metadata("design:type", String)
], ProjectComment.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => project_entity_1.Project, (project) => project.comments, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: "projectId" }),
    __metadata("design:type", project_entity_1.Project)
], ProjectComment.prototype, "project", void 0);
ProjectComment = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Tree)("closure-table", {
        closureTableName: "project_comment_closure",
    })
], ProjectComment);
exports.ProjectComment = ProjectComment;
//# sourceMappingURL=project-comment.entity.js.map