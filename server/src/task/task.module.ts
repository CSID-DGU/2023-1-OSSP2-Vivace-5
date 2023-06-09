import { Module } from "@nestjs/common";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { TypeOrmExModule } from "src/typeorm/typeorm-ex.module";
import { TaskRepository } from "./task.repository";
import { UserModule } from "src/user/user.module";
import { ProjectRepository } from "src/project/project.repository";
import { UserRepository } from "src/user/user.repository";
import { BookmarkRepository } from "./bookmark.repository";
import { KanbanColumnRepository } from "./kanban-column.repository";
import { TaskContentRepository } from "./task-content.repository";

@Module({
    imports: [
        TypeOrmExModule.forCustomRepository([
            TaskRepository,
            ProjectRepository,
            UserRepository,
            BookmarkRepository,
            KanbanColumnRepository,
            TaskContentRepository,
        ]),
        UserModule,
    ],
    controllers: [TaskController],
    providers: [TaskService],
    exports: [],
})
export class TaskModule {}
