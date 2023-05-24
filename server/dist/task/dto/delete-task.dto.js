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
exports.DeleteTaskDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class DeleteTaskDto {
}
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, swagger_1.ApiProperty)({
        name: "taskId",
        type: "string",
        example: "8d9f3043-124e-40a5-842f-013f8ee35253",
        description: "The UUID of task that will be deleted",
    }),
    __metadata("design:type", String)
], DeleteTaskDto.prototype, "taskId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)({
        name: "cascading",
        type: "boolean",
        example: false,
        description: "Whether user delete its all descendants together or not",
    }),
    __metadata("design:type", Boolean)
], DeleteTaskDto.prototype, "cascading", void 0);
exports.DeleteTaskDto = DeleteTaskDto;
//# sourceMappingURL=delete-task.dto.js.map