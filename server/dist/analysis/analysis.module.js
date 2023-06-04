"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisModule = void 0;
const common_1 = require("@nestjs/common");
const analysis_controller_1 = require("./analysis.controller");
const analysis_service_1 = require("./analysis.service");
const user_module_1 = require("../user/user.module");
const typeorm_ex_module_1 = require("../typeorm/typeorm-ex.module");
const task_repository_1 = require("../task/task.repository");
const project_repository_1 = require("../project/project.repository");
let AnalysisModule = class AnalysisModule {
};
AnalysisModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_ex_module_1.TypeOrmExModule.forCustomRepository([task_repository_1.TaskRepository, project_repository_1.ProjectRepository]), user_module_1.UserModule],
        controllers: [analysis_controller_1.AnalysisController],
        providers: [analysis_service_1.AnalysisService],
    })
], AnalysisModule);
exports.AnalysisModule = AnalysisModule;
//# sourceMappingURL=analysis.module.js.map