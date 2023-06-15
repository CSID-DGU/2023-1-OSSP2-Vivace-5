import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateBookmarkDto {
    @IsString()
    title: string;

    @IsUUID()
    projectId: string;

    @IsOptional()
    @IsUUID()
    taskId: string;

    @IsOptional()
    @IsUUID()
    parentId: string;
}
