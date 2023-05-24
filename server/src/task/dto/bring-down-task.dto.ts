import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class BringDownTaskDto {
    @IsUUID()
    @ApiProperty({
        name: "taskId",
        type: "string",
        example: "1268c369-9f46-44f4-b3f9-0c0f14f25cd9",
        description: "UUID of the task that will be brought down",
    })
    taskId: string;

    @IsUUID()
    @ApiProperty({
        name: "taskIdToParent",
        type: "string",
        example: "8d9f3043-124e-40a5-842f-013f8ee35253",
        description: "UUID of the task that will be parent of task specified by taskId",
    })
    taskIdToParent: string;
}
