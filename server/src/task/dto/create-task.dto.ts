import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { SubTask } from "src/enum/sub-task.enum";

export class CreateTaskDto {
    @IsUUID()
    @ApiProperty({
        name: "projectId",
        type: "string",
        example: "3148412e-1a62-46dc-97b2-b84a27eaffe8",
        description: "Project UUID that you want to create task for",
    })
    projectId: string;

    @IsOptional()
    @IsUUID()
    @ApiPropertyOptional({
        name: "parentId",
        type: "string",
        example: "1268c369-9f46-44f4-b3f9-0c0f14f25cd9",
        description:
            "Task UUID if parnet task is not Kanban board, or Column UUID if parnet task is Kanban board. If this value is none, a created task should be root.",
    })
    parentId: string;

    @IsBoolean()
    @ApiProperty({
        name: "isKanban",
        type: "boolean",
        example: false,
        description: "Whether parent task is kanban board or not",
    })
    isKanban: boolean;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        name: "title",
        type: "string",
        example: "My task",
        description: "Task title",
    })
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        name: "description",
        type: "string",
        example: "Short description",
        description: "Task description",
    })
    description: string;

    @IsEnum(SubTask)
    @ApiProperty({
        name: "type",
        type: "enum",
        enum: [SubTask.GRAPH, SubTask.KANBAN, SubTask.LIST, SubTask.TERMINAL],
        example: SubTask.GRAPH,
        description: "Task type describing how to include subwork",
    })
    type: SubTask;

    @Type(() => Date)
    @IsDate()
    @ApiProperty({
        name: "start",
        type: "string",
        example: "2023-05-18T16:27:50Z",
        description: "Task start date",
    })
    start: Date;

    @Type(() => Date)
    @IsDate()
    @ApiProperty({
        name: "deadline",
        type: "string",
        example: "2023-05-23T16:27:50Z",
        description: "Task deadline",
    })
    deadline: Date;
}
