import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsUUID } from "class-validator";

export class DeleteTaskDto {
    @IsUUID()
    @ApiProperty({
        name: "taskId",
        type: "string",
        example: "8d9f3043-124e-40a5-842f-013f8ee35253",
        description: "The UUID of task that will be deleted",
    })
    taskId: string;

    @IsBoolean()
    @ApiProperty({
        name: "cascading",
        type: "boolean",
        example: false,
        description: "Whether user delete its all descendants together or not",
    })
    cascading: boolean;
}
