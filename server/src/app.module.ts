import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ProjectModule } from "./project/project.module";
import { AnalysisModule } from "./analysis/analysis.module";
import { TaskModule } from "./task/task.module";

@Module({
    imports: [UserModule, AuthModule, ProjectModule, AnalysisModule, TaskModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
