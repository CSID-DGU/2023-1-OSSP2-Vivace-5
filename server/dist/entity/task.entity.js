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
var Task_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const project_entity_1 = require("./project.entity");
const sub_task_enum_1 = require("../enum/sub-task.enum");
const user_to_task_entity_1 = require("./user-to-task.entity");
const typeorm_1 = require("typeorm");
const kanban_column_entity_1 = require("./kanban-column.entity");
let Task = Task_1 = class Task extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Task.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "filePath", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Task.prototype, "mailstone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Task.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Task.prototype, "modifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Task.prototype, "start", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Task.prototype, "end", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Task.prototype, "deadline", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Task.prototype, "isFinished", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => kanban_column_entity_1.KanbanColumn, (childColumns) => childColumns.parent, { eager: false }),
    __metadata("design:type", Array)
], Task.prototype, "childColumns", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => kanban_column_entity_1.KanbanColumn, (parentColumn) => parentColumn.children, { eager: false }),
    __metadata("design:type", kanban_column_entity_1.KanbanColumn)
], Task.prototype, "parentColumn", void 0);
__decorate([
    (0, typeorm_1.TreeParent)(),
    __metadata("design:type", Task)
], Task.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.TreeChildren)(),
    __metadata("design:type", Array)
], Task.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => Task_1, (task) => task.successors, { eager: false }),
    __metadata("design:type", Array)
], Task.prototype, "predecessors", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => Task_1, (task) => task.predecessors, { eager: false }),
    __metadata("design:type", Array)
], Task.prototype, "successors", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "projectId" }),
    __metadata("design:type", String)
], Task.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => project_entity_1.Project, (project) => project.tasks, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: "projectId" }),
    __metadata("design:type", project_entity_1.Project)
], Task.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => user_to_task_entity_1.UserToTask, (userToTask) => userToTask.task, { eager: false }),
    __metadata("design:type", Array)
], Task.prototype, "userToTasks", void 0);
Task = Task_1 = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Tree)("closure-table", {
        closureTableName: "task_closure",
    })
], Task);
exports.Task = Task;
//# sourceMappingURL=task.entity.js.map