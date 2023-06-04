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
exports.UpdateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UpdateUserDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Cheolsu",
        description: "First name",
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Kim",
        description: "Last name",
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1998,
        description: "Year of birth",
        required: true,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => Number.parseInt(value)),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 2,
        description: "Month of birth",
        required: true,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => Number.parseInt(value)),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 14,
        description: "Day of birth",
        required: true,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => Number.parseInt(value)),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "동국대학교",
        description: "소속",
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "belong", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Republic of Korea",
        description: "Country",
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Seoul",
        description: "Region",
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "region", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAT1JREFUeNrsV0kKwjAQxNeD13tRd7VjICJKSiZpOUVZiMtbjKqB3MhBxjo2VnYWFB0YAl1YZdj4JZKjQRBQ0FAUcR8kS5jxue5m5z5/44vY8e6WZ/6BZj/HPgAlVIkQXoWxUHLYMmkjKUkY6UJW6jo+xlZfKys6uxqvvevX2J6scop+6phbBWWzgVRJ3q4LzJZ/KQ2Z+JWMRnXbS9xTR5GpwAAAABJRU5ErkJggg==",
        description: "Image",
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "encodedImg", void 0);
exports.UpdateUserDto = UpdateUserDto;
//# sourceMappingURL=update-user.dto.js.map