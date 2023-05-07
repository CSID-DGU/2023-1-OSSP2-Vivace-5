import { Module } from "@nestjs/common";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { TypeOrmExModule } from "src/typeorm/typeorm-ex.module";
import { TaskRepository } from "./task.repository";

@Module({
    imports: [TypeOrmExModule.forCustomRepository([TaskRepository])],
    controllers: [TaskController],
    providers: [TaskService],
    exports: [],
})
export class TaskModule {}
