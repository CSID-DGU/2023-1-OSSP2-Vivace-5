import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { UserRight } from "../../enum/user-right.enum";
import { Type } from "class-transformer";
import { SubTask } from "../../enum/sub-task.enum";
import { ApiProperty } from "@nestjs/swagger";

export class MemberDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ name: "id", type: "string", description: "User UUID" })
    id: string;

    @IsNotEmpty()
    @ApiProperty({
        name: "right",
        enum: [
            UserRight.ADMIN,
            UserRight.COMPLETION_MOD,
            UserRight.MEMBER_AND_TASK_MGT,
            UserRight.MEMBER_MGT,
            UserRight.TASK_MGT,
        ],
        description: "User right to grant",
    })
    right: UserRight;
}

export class ProjectInfoDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ name: "title", type: "string" })
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ name: "description", type: "string" })
    description: string;

    @IsNotEmpty()
    @ApiProperty({
        name: "type",
        enum: [SubTask.GRAPH, SubTask.KANBAN, SubTask.LIST, SubTask.TERMINAL],
        description: "type of sub-tasks",
    })
    type: SubTask;

    @IsString()
    @ApiProperty({ name: "encodedImg", type: "string", description: "project icon encoded by base64" })
    encodedImg: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MemberDto)
    @ApiProperty({
        name: "members",
        type: "array",
        items: {
            type: "object",
            properties: {
                name: { type: "string" },
                right: {
                    type: "enum",
                    enum: [
                        UserRight.ADMIN,
                        UserRight.COMPLETION_MOD,
                        UserRight.MEMBER_AND_TASK_MGT,
                        UserRight.MEMBER_MGT,
                        UserRight.TASK_MGT,
                    ],
                },
            },
        },
        description: "array of pairs of the member UUID and right to grant",
    })
    members: MemberDto[];
}
