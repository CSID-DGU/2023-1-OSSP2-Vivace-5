import { Module } from "@nestjs/common";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { TypeOrmExModule } from "src/typeorm/typeorm-ex.module";
import { ProjectRepository } from "./project.repository";
import { UserModule } from "src/user/user.module";
import { UserToProjectRepository } from "./user-to-project.repository";
import { ProjectCommentRepository } from "./project-comment.repository";
import { TaskRepository } from "src/task/task.repository";
import { UserRepository } from "src/user/user.repository";

@Module({
    imports: [
        TypeOrmExModule.forCustomRepository([
            ProjectRepository,
            UserToProjectRepository,
            ProjectCommentRepository,
            TaskRepository,
            UserRepository,
        ]),
        UserModule,
    ],
    controllers: [ProjectController],
    providers: [ProjectService],
})
export class ProjectModule {}
