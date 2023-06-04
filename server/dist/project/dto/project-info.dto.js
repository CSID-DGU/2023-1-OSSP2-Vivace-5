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
exports.ProjectInfoDto = exports.MemberDto = void 0;
const class_validator_1 = require("class-validator");
const user_right_enum_1 = require("../../enum/user-right.enum");
const class_transformer_1 = require("class-transformer");
const sub_task_enum_1 = require("../../enum/sub-task.enum");
const swagger_1 = require("@nestjs/swagger");
class MemberDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ name: "id", type: "string", description: "User UUID" }),
    __metadata("design:type", String)
], MemberDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        name: "right",
        enum: [
            user_right_enum_1.UserRight.ADMIN,
            user_right_enum_1.UserRight.COMPLETION_MOD,
            user_right_enum_1.UserRight.MEMBER_AND_TASK_MGT,
            user_right_enum_1.UserRight.MEMBER_MGT,
            user_right_enum_1.UserRight.TASK_MGT,
        ],
        description: "User right to grant",
    }),
    __metadata("design:type", String)
], MemberDto.prototype, "right", void 0);
exports.MemberDto = MemberDto;
class ProjectInfoDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ name: "title", type: "string" }),
    __metadata("design:type", String)
], ProjectInfoDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ name: "description", type: "string" }),
    __metadata("design:type", String)
], ProjectInfoDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        name: "type",
        enum: [sub_task_enum_1.SubTask.GRAPH, sub_task_enum_1.SubTask.KANBAN, sub_task_enum_1.SubTask.LIST, sub_task_enum_1.SubTask.TERMINAL],
        description: "type of sub-tasks",
    }),
    __metadata("design:type", String)
], ProjectInfoDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ name: "encodedImg", type: "string", description: "project icon encoded by base64" }),
    __metadata("design:type", String)
], ProjectInfoDto.prototype, "encodedImg", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MemberDto),
    (0, swagger_1.ApiProperty)({
        name: "members",
        type: "array",
        items: {
            type: "object",
            properties: {
                name: { type: "string" },
                right: {
                    type: "enum",
                    enum: [
                        user_right_enum_1.UserRight.ADMIN,
                        user_right_enum_1.UserRight.COMPLETION_MOD,
                        user_right_enum_1.UserRight.MEMBER_AND_TASK_MGT,
                        user_right_enum_1.UserRight.MEMBER_MGT,
                        user_right_enum_1.UserRight.TASK_MGT,
                    ],
                },
            },
        },
        description: "array of pairs of the member UUID and right to grant",
    }),
    __metadata("design:type", Array)
], ProjectInfoDto.prototype, "members", void 0);
exports.ProjectInfoDto = ProjectInfoDto;
//# sourceMappingURL=project-info.dto.js.map