import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { SubTask } from "src/enum/sub-task.enum";

export class CreateContentDto {
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
    @IsOptional()
    @ApiProperty({
        name: "content",
        type: "string",
        description: "Task content",
    })
    content: string;
}

export class UpdateContentDto {
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
    @IsOptional()
    @ApiProperty({
        name: "content",
        type: "string",
        description: "Task content",
    })
    content: string;
}