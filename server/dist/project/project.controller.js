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
exports.ProjectController = void 0;
const common_1 = require("@nestjs/common");
const project_service_1 = require("./project.service");
const user_entity_1 = require("../entity/user.entity");
const passport_1 = require("@nestjs/passport");
const get_user_decorator_1 = require("../user/get-user.decorator");
const project_info_validation_pipe_1 = require("../pipe/project-info-validation.pipe");
const project_info_dto_1 = require("./dto/project-info.dto");
const encoded_img_validation_pipe_1 = require("../pipe/encoded-img-validation.pipe");
const uuid_validation_pipe_1 = require("../pipe/uuid-validation.pipe");
const boolean_validation_pipe_1 = require("../pipe/boolean-validation.pipe");
const is_not_empty_string_pipe_1 = require("../pipe/is-not-empty-string.pipe");
let ProjectController = class ProjectController {
    constructor(projectService) {
        this.projectService = projectService;
        this.logger = new common_1.Logger("ProjectController");
    }
    getAllProjects(user, query) {
        this.logger.verbose(`User "${user.email}" trying to get his or her project list.`);
        return this.projectService.getAllProjects(user, query);
    }
    getProjectInfo(user, projectId) {
        this.logger.verbose(`User "${user.email}" trying to get the info of project "${projectId}".`);
        return this.projectService.getProjectInfo(user, projectId);
    }
    createProject(user, projectInfoDto) {
        this.logger.verbose(`User "${user.email}" trying to create project.`);
        return this.projectService.createProject(user, projectInfoDto);
    }
    updateProject(user, projectId, projectInfoDto) {
        this.logger.verbose(`User "${user.email}" trying to update project "${projectId}".`);
        return this.projectService.updateProject(user, projectId, projectInfoDto);
    }
    deleteProject(user, projectId) {
        this.logger.verbose(`User "${user.email}" trying to delete project "${projectId}".`);
        return this.projectService.deleteProject(user, projectId);
    }
    invite(user, projectId, members) {
        this.logger.verbose(`User "${user.email}" trying to invite some people into project "${projectId}".`);
        return this.projectService.invite(user, projectId, members);
    }
    dismiss(user, projectId, members) {
        this.logger.verbose(`User "${user.email}" trying to dismiss some members from this project "${projectId}".`);
        return this.projectService.dismiss(user, projectId, members);
    }
    withdraw(user, projectId) {
        this.logger.verbose(`User "${user.email}" trying to withdraw from this project "${projectId}".`);
        return this.projectService.withdraw(user, projectId);
    }
    addCommment(user, projectId, content) {
        this.logger.verbose(`User "${user.email}" trying to comment on this project "${projectId}".`);
        return this.projectService.addComment(user, projectId, content);
    }
    addReply(user, commentId, content) {
        this.logger.verbose(`User "${user.email}" trying to reply on the comment "${commentId}".`);
        return this.projectService.addReply(user, commentId, content);
    }
    getAllComments(user, projectId, query) {
        this.logger.verbose(`User "${user.email}" trying to get all comments of this project "${projectId}".`);
        return this.projectService.getAllComments(user, projectId, query);
    }
    updateCommentContent(user, commentId, content) {
        this.logger.verbose(`User "${user.email}" trying to update content of the comment "${commentId}" in this project.`);
        return this.projectService.updateCommentContent(user, commentId, content);
    }
    updateCommentPinStatus(user, commentId, pinned) {
        this.logger.verbose(`User "${user.email}" trying to update pin status of the comment "${commentId}" in this project.`);
        return this.projectService.updateCommentFixStatus(user, commentId, pinned);
    }
    deleteComment(user, commentId) {
        this.logger.verbose(`User "${user.email}" trying to delete the comment "${commentId}" in this project.`);
        return this.projectService.deleteComment(user, commentId);
    }
};
__decorate([
    (0, common_1.Get)("/"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getAllProjects", null);
__decorate([
    (0, common_1.Get)("/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "getProjectInfo", null);
__decorate([
    (0, common_1.Post)("/create"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe, project_info_validation_pipe_1.ProjectInfoValidationPipe, encoded_img_validation_pipe_1.EncodedImgValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        project_info_dto_1.ProjectInfoDto]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "createProject", null);
__decorate([
    (0, common_1.Put)("/update/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)(common_1.ValidationPipe, project_info_validation_pipe_1.ProjectInfoValidationPipe, encoded_img_validation_pipe_1.EncodedImgValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, project_info_dto_1.ProjectInfoDto]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "updateProject", null);
__decorate([
    (0, common_1.Delete)("/delete/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "deleteProject", null);
__decorate([
    (0, common_1.Patch)("/invite/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)("members", common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Array]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "invite", null);
__decorate([
    (0, common_1.Patch)("/dismiss/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)("members", common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Array]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "dismiss", null);
__decorate([
    (0, common_1.Delete)("/withdraw/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "withdraw", null);
__decorate([
    (0, common_1.Post)("/comment/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Body)("content", is_not_empty_string_pipe_1.IsNotEmptyStringPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "addCommment", null);
__decorate([
    (0, common_1.Post)("/reply/:commentId"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("commentId", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Body)("content", is_not_empty_string_pipe_1.IsNotEmptyStringPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "addReply", null);
__decorate([
    (0, common_1.Get)("/comment/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Query)("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getAllComments", null);
__decorate([
    (0, common_1.Patch)("/comment/update/content/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Body)("content", is_not_empty_string_pipe_1.IsNotEmptyStringPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "updateCommentContent", null);
__decorate([
    (0, common_1.Patch)("/comment/update/fixed/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __param(2, (0, common_1.Body)("pinned", boolean_validation_pipe_1.BooleanValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String, Boolean]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "updateCommentPinStatus", null);
__decorate([
    (0, common_1.Delete)("/comment/delete/:id"),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)("id", uuid_validation_pipe_1.UUIDValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "deleteComment", null);
ProjectController = __decorate([
    (0, common_1.Controller)("project"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __metadata("design:paramtypes", [project_service_1.ProjectService])
], ProjectController);
exports.ProjectController = ProjectController;
//# sourceMappingURL=project.controller.js.map