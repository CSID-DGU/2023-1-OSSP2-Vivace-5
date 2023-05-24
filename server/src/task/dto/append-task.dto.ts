import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsUUID } from "class-validator";

export class AppendTaskDto {
    @IsUUID()
    @ApiProperty({
        name: "taskId",
        type: "string",
        example: "8d9f3043-124e-40a5-842f-013f8ee35253",
        description: "The UUID of task that predecessors or succesors will be attached",
    })
    taskId: string;

    @IsArray()
    @IsUUID("all", { each: true })
    @ArrayMinSize(1)
    @ApiProperty({
        name: "taskIdsToAppend",
        type: "array",
        example: ["bc25ebc8-23b3-4df0-a853-f1c291bc6e92", "4014c3d5-5d3d-4de2-8bbd-9caa52dc7fa0"],
        items: {
            type: "string",
        },
        description: "The UUIDs of tasks that will be attached as predecessor or succesors",
    })
    taskIdsToAppend: string[];
}
