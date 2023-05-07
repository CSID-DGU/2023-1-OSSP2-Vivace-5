import { Module } from "@nestjs/common";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { TypeOrmExModule } from "src/typeorm/typeorm-ex.module";
import { ProjectRepository } from "./project.repository";
import { UserModule } from "src/user/user.module";
import { UserToProjectRepository } from "./user-to-project.repository";
import { ProjectCommentRepository } from "./project-comment.repository";

@Module({
    imports: [
        TypeOrmExModule.forCustomRepository([ProjectRepository, UserToProjectRepository, ProjectCommentRepository]),
        UserModule,
    ],
    controllers: [ProjectController],
    providers: [ProjectService],
})
export class ProjectModule {}
