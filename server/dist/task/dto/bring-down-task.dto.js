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
exports.BringDownTaskDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class BringDownTaskDto {
}
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, swagger_1.ApiProperty)({
        name: "taskId",
        type: "string",
        example: "1268c369-9f46-44f4-b3f9-0c0f14f25cd9",
        description: "UUID of the task that will be brought down",
    }),
    __metadata("design:type", String)
], BringDownTaskDto.prototype, "taskId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, swagger_1.ApiProperty)({
        name: "taskIdToParent",
        type: "string",
        example: "8d9f3043-124e-40a5-842f-013f8ee35253",
        description: "UUID of the task that will be parent of task specified by taskId",
    }),
    __metadata("design:type", String)
], BringDownTaskDto.prototype, "taskIdToParent", void 0);
exports.BringDownTaskDto = BringDownTaskDto;
//# sourceMappingURL=bring-down-task.dto.js.map