import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { ProjectModule } from "./project/project.module";
import { AnalysisModule } from "./analysis/analysis.module";
import { TaskModule } from "./task/task.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMConfig } from "./typeorm/typeorm.config";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot(typeORMConfig),
        UserModule,
        ProjectModule,
        AnalysisModule,
        TaskModule,
        ConfigModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
