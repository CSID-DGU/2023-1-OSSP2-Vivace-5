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
exports.AppendTaskDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AppendTaskDto {
}
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, swagger_1.ApiProperty)({
        name: "taskId",
        type: "string",
        example: "8d9f3043-124e-40a5-842f-013f8ee35253",
        description: "The UUID of task that predecessors or succesors will be attached",
    }),
    __metadata("design:type", String)
], AppendTaskDto.prototype, "taskId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)("all", { each: true }),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, swagger_1.ApiProperty)({
        name: "taskIdsToAppend",
        type: "array",
        example: ["bc25ebc8-23b3-4df0-a853-f1c291bc6e92", "4014c3d5-5d3d-4de2-8bbd-9caa52dc7fa0"],
        items: {
            type: "string",
        },
        description: "The UUIDs of tasks that will be attached as predecessor or succesors",
    }),
    __metadata("design:type", Array)
], AppendTaskDto.prototype, "taskIdsToAppend", void 0);
exports.AppendTaskDto = AppendTaskDto;
//# sourceMappingURL=append-task.dto.js.map