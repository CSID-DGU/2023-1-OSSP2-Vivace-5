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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const sign_up_dto_1 = require("./dto/sign-up.dto");
const auth_credentials_dto_1 = require("./dto/auth-credentials.dto");
const passport_1 = require("@nestjs/passport");
const get_user_decorator_1 = require("../decorator/get-user.decorator");
const user_entity_1 = require("../entity/user.entity");
const update_user_dto_1 = require("./dto/update-user.dto");
const update_password_dto_1 = require("./dto/update-password.dto");
const encoded_img_validation_pipe_1 = require("../pipe/encoded-img-validation.pipe");
const swagger_1 = require("@nestjs/swagger");
const confirm_password_dto_1 = require("./dto/confirm-password.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
        this.logger = new common_1.Logger("UserController");
    }
    signUp(signUpDto) {
        this.logger.verbose(`"${signUpDto.email}" trying to sign up.`);
        return this.userService.signUp(signUpDto);
    }
    signIn(authCredentialsDto) {
        this.logger.verbose(`"${authCredentialsDto.email}" trying to sign in.`);
        return this.userService.signIn(authCredentialsDto);
    }
    getMyInfo(user) {
        this.logger.verbose(`"${user.email}" trying to get personal information.`);
        return this.userService.extractPublicInfo(user);
    }
    getUserInfo(userId) {
        this.logger.verbose(`User trying to get information of "${userId}".`);
        return this.userService.getUserInfo(userId);
    }
    updateUser(user, updateUserDto) {
        this.logger.verbose(`"${user.email}" trying to update personal information.`);
        return this.userService.updateUser(user, updateUserDto);
    }
    updatePassword(user, updatePasswordDto) {
        this.logger.verbose(`"${user.email}" trying to update password.`);
        return this.userService.updatePassword(user, updatePasswordDto);
    }
    withdraw(user, confirmPasswordDto) {
        this.logger.verbose(`"${user.email}" trying to withdraw from this service.`);
        return this.userService.withdraw(user, confirmPasswordDto);
    }
};
__decorate([
    (0, common_1.Post)("/signup"),
    (0, swagger_1.ApiOperation)({
        summary: "Sign up API",
        description: "Sign up",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "User successfully sign up in this service",
    }),
    (0, swagger_1.ApiConflictResponse)({
        description: "If entered email is already existing",
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        description: "Else",
    }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe, encoded_img_validation_pipe_1.EncodedImgValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_up_dto_1.SignUpDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)("/signin"),
    (0, swagger_1.ApiOperation)({
        summary: "Sign in API",
        description: "이메일와 비밀번호를 통해 sign in 진행",
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: "Return JWT access token.",
        schema: {
            type: "object",
            properties: {
                accessToken: {
                    type: "string",
                    description: "JWT access token",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhYWFrMUBnbWFpbC5jb20iLCJpYXQiOjE2ODQ5OTgzODN9.CghJCjoAEcCx-b7QR-7u1jgXZgJ99nBBydf7U0ZWYIQ",
                },
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: "If user having entered email is not existing or entered password is not same as password saved in DB.",
    }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_credentials_dto_1.AuthCredentialsDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signIn", null);
__decorate([
    (0, common_1.Get)("/info"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({
        summary: "로그인한 유저 정보 조회 API",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Return User info.",
        schema: {
            type: "object",
            properties: {
                id: { type: "string", description: "User UUID", example: "bf536e46-90d3-44b8-9bf9-c17bf1a8fe42" },
                firstName: { type: "string", example: "Hong" },
                lastName: { type: "string", example: "Gil Dong" },
                email: { type: "string", example: "gildong@dongguk.edu" },
                year: { type: "number", example: 1998 },
                month: { type: "number", example: 12 },
                date: { type: "number", example: 15 },
                belong: { type: "string", example: "Dongguk Univ." },
                country: { type: "string", example: "Republic of korea" },
                region: { type: "string", example: "Gyunggi-do" },
                encodedImg: {
                    type: "string",
                    description: "User Profile Image in Base64 endcoding",
                    example: "data:image/jpeg;base64,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",
                },
                createdAt: { type: "string", example: "2023-05-20T12:42:54.000Z" },
            },
        },
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Object)
], UserController.prototype, "getMyInfo", null);
__decorate([
    (0, common_1.Get)("/info/:id"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({
        summary: "아이디를 통해 원하는 유저 정보 조회 API",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Return User info.",
        schema: {
            type: "object",
            properties: {
                id: { type: "string", description: "User UUID", example: "bf536e46-90d3-44b8-9bf9-c17bf1a8fe42" },
                firstName: { type: "string", example: "Hong" },
                lastName: { type: "string", example: "Gil Dong" },
                email: { type: "string", example: "gildong@dongguk.edu" },
                year: { type: "number", example: 1998 },
                month: { type: "number", example: 12 },
                date: { type: "number", example: 15 },
                belong: { type: "string", example: "Dongguk Univ." },
                country: { type: "string", example: "Republic of korea" },
                region: { type: "string", example: "Gyunggi-do" },
                encodedImg: {
                    type: "string",
                    description: "User Profile Image in Base64 endcoding",
                    example: "data:image/jpeg;base64,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",
                },
                createdAt: { type: "string", example: "2023-05-20T12:42:54.000Z" },
            },
        },
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: "If no user corresponds to the specified userId",
    }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserInfo", null);
__decorate([
    (0, common_1.Put)("/update/info"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({
        summary: "유저 정보 변경 API",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "User information are successfully updated",
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe, encoded_img_validation_pipe_1.EncodedImgValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Patch)("/update/password"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({
        summary: "비밀번호 변경 API",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "Password are successfully updated",
    }),
    (0, swagger_1.ApiNotAcceptableResponse)({
        description: "If the password before and after the change are the same.",
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, update_password_dto_1.UpdatePasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Delete)("/withdraw"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiBearerAuth)("access-token"),
    (0, swagger_1.ApiOperation)({
        summary: "유저 탈퇴 API",
    }),
    (0, swagger_1.ApiOkResponse)({
        description: "User are successfully deleted",
    }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, confirm_password_dto_1.ConfirmPasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "withdraw", null);
UserController = __decorate([
    (0, common_1.Controller)("user"),
    (0, swagger_1.ApiTags)("User API"),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map