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
const get_user_decorator_1 = require("./get-user.decorator");
const user_entity_1 = require("../entity/user.entity");
const update_user_dto_1 = require("./dto/update-user.dto");
const update_password_dto_1 = require("./dto/update-password.dto");
const encoded_img_validation_pipe_1 = require("../pipe/encoded-img-validation.pipe");
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
    updatePassword(user, confirmPasswordDto) {
        this.logger.verbose(`"${user.email}" trying to update password.`);
        return this.userService.updatePassword(user, confirmPasswordDto);
    }
    withdraw(user, confirmPasswordDto) {
        this.logger.verbose(`"${user.email}" trying to withdraw from this service.`);
        return this.userService.withdraw(user, confirmPasswordDto);
    }
};
__decorate([
    (0, common_1.Post)("/signup"),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe, encoded_img_validation_pipe_1.EncodedImgValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_up_dto_1.SignUpDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)("/signin"),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_credentials_dto_1.AuthCredentialsDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signIn", null);
__decorate([
    (0, common_1.Get)("/info"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Object)
], UserController.prototype, "getMyInfo", null);
__decorate([
    (0, common_1.Get)("/info/:id"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserInfo", null);
__decorate([
    (0, common_1.Put)("/update/info"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
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
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, update_password_dto_1.ConfirmPasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Delete)("/withdraw"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, update_password_dto_1.ConfirmPasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "withdraw", null);
UserController = __decorate([
    (0, common_1.Controller)("user"),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map