import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { UserRight } from "../../enum/user-right.enum";
import { Type } from "class-transformer";
import { SubTask } from "../../enum/sub-task.enum";

export class MemberDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    right: UserRight;
}

export class ProjectInfoDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    type: SubTask;

    @IsString()
    encodedImg: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MemberDto)
    members: MemberDto[];
}
