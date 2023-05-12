import { Module } from "@nestjs/common";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { TypeOrmExModule } from "src/typeorm/typeorm-ex.module";
import { TaskRepository } from "./task.repository";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [TypeOrmExModule.forCustomRepository([TaskRepository]), UserModule],
    controllers: [TaskController],
    providers: [TaskService],
    exports: [],
})
export class TaskModule {}
