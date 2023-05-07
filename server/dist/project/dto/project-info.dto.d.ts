import { UserRight } from "../../enum/user-right.enum";
import { SubTask } from "../../enum/sub-task.enum";
export declare class MemberDto {
    id: string;
    right: UserRight;
}
export declare class ProjectInfoDto {
    title: string;
    description: string;
    type: SubTask;
    encodedImg: string;
    members: MemberDto[];
}
