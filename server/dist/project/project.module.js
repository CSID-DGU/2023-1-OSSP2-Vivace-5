"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModule = void 0;
const common_1 = require("@nestjs/common");
const project_controller_1 = require("./project.controller");
const project_service_1 = require("./project.service");
const typeorm_ex_module_1 = require("../typeorm/typeorm-ex.module");
const project_repository_1 = require("./project.repository");
const user_module_1 = require("../user/user.module");
const user_to_project_repository_1 = require("./user-to-project.repository");
const project_comment_repository_1 = require("./project-comment.repository");
let ProjectModule = class ProjectModule {
};
ProjectModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_ex_module_1.TypeOrmExModule.forCustomRepository([project_repository_1.ProjectRepository, user_to_project_repository_1.UserToProjectRepository, project_comment_repository_1.ProjectCommentRepository]),
            user_module_1.UserModule,
        ],
        controllers: [project_controller_1.ProjectController],
        providers: [project_service_1.ProjectService],
    })
], ProjectModule);
exports.ProjectModule = ProjectModule;
//# sourceMappingURL=project.module.js.map