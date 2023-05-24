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
exports.CreateTaskDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const sub_task_enum_1 = require("../../enum/sub-task.enum");
class CreateTaskDto {
}
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, swagger_1.ApiProperty)({
        name: "projectId",
        type: "string",
        example: "3148412e-1a62-46dc-97b2-b84a27eaffe8",
        description: "Project UUID that you want to create task for",
    }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "projectId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, swagger_1.ApiPropertyOptional)({
        name: "parentId",
        type: "string",
        example: "1268c369-9f46-44f4-b3f9-0c0f14f25cd9",
        description: "Task UUID if parnet task is not Kanban board, or Column UUID if parnet task is Kanban board. If this value is none, a created task should be root.",
    }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "parentId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        name: "isKanban",
        type: "boolean",
        example: false,
        description: "Whether parent task is kanban board or not",
    }),
    __metadata("design:type", Boolean)
], CreateTaskDto.prototype, "isKanban", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        name: "title",
        type: "string",
        example: "My task",
        description: "Task title",
    }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        name: "description",
        type: "string",
        example: "Short description",
        description: "Task description",
    }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(sub_task_enum_1.SubTask),
    (0, swagger_1.ApiProperty)({
        name: "type",
        type: "enum",
        enum: [sub_task_enum_1.SubTask.GRAPH, sub_task_enum_1.SubTask.KANBAN, sub_task_enum_1.SubTask.LIST, sub_task_enum_1.SubTask.TERMINAL],
        example: sub_task_enum_1.SubTask.GRAPH,
        description: "Task type describing how to include subwork",
    }),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({
        name: "start",
        type: "string",
        example: "2023-05-18T16:27:50Z",
        description: "Task start date",
    }),
    __metadata("design:type", Date)
], CreateTaskDto.prototype, "start", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, swagger_1.ApiProperty)({
        name: "deadline",
        type: "string",
        example: "2023-05-23T16:27:50Z",
        description: "Task deadline",
    }),
    __metadata("design:type", Date)
], CreateTaskDto.prototype, "deadline", void 0);
exports.CreateTaskDto = CreateTaskDto;
//# sourceMappingURL=create-task.dto.js.map