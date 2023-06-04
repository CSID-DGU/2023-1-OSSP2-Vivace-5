import { Module } from "@nestjs/common";
import { AnalysisController } from "./analysis.controller";
import { AnalysisService } from "./analysis.service";
import { UserModule } from "src/user/user.module";
import { TypeOrmExModule } from "src/typeorm/typeorm-ex.module";
import { TaskRepository } from "src/task/task.repository";
import { ProjectRepository } from "src/project/project.repository";

@Module({
    imports: [TypeOrmExModule.forCustomRepository([TaskRepository, ProjectRepository]), UserModule],
    controllers: [AnalysisController],
    providers: [AnalysisService],
})
export class AnalysisModule {}
