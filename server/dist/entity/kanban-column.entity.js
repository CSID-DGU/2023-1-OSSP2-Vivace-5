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
var KanbanColumn_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanbanColumn = void 0;
const typeorm_1 = require("typeorm");
const task_entity_1 = require("./task.entity");
const project_entity_1 = require("./project.entity");
let KanbanColumn = KanbanColumn_1 = class KanbanColumn extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], KanbanColumn.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], KanbanColumn.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.OneToOne)((type) => KanbanColumn_1, (predecessor) => predecessor.successor, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: "predecessorId" }),
    __metadata("design:type", KanbanColumn)
], KanbanColumn.prototype, "predecessor", void 0);
__decorate([
    (0, typeorm_1.OneToOne)((type) => KanbanColumn_1, (successor) => successor.predecessor, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: "successorId" }),
    __metadata("design:type", KanbanColumn)
], KanbanColumn.prototype, "successor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "parentId" }),
    __metadata("design:type", String)
], KanbanColumn.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => task_entity_1.Task, (task) => task.childColumns, { eager: false, onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "parentId" }),
    __metadata("design:type", task_entity_1.Task)
], KanbanColumn.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => task_entity_1.Task, (task) => task.parentColumn, { eager: false }),
    __metadata("design:type", Array)
], KanbanColumn.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "projectId" }),
    __metadata("design:type", String)
], KanbanColumn.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, (project) => project.columns, { eager: false, onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "projectId" }),
    __metadata("design:type", project_entity_1.Project)
], KanbanColumn.prototype, "project", void 0);
KanbanColumn = KanbanColumn_1 = __decorate([
    (0, typeorm_1.Entity)()
], KanbanColumn);
exports.KanbanColumn = KanbanColumn;
//# sourceMappingURL=kanban-column.entity.js.map