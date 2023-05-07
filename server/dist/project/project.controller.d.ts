import { ProjectService } from "./project.service";
import { User } from "src/entity/user.entity";
import { MemberDto, ProjectInfoDto } from "./dto/project-info.dto";
import { Project } from "../entity/project.entity";
import { ProjectComment } from "src/entity/project-comment.entity";
export declare class ProjectController {
    private projectService;
    private logger;
    constructor(projectService: ProjectService);
    getAllProjects(user: User, query: string): Promise<Project[]>;
    getProjectInfo(user: User, projectId: string): Promise<Project>;
    createProject(user: User, projectInfoDto: ProjectInfoDto): Promise<{
        notFoundUserId: string[];
    }>;
    updateProject(user: User, projectId: string, projectInfoDto: ProjectInfoDto): Promise<{
        notFoundUserId: string[];
    }>;
    deleteProject(user: User, projectId: string): Promise<void>;
    invite(user: User, projectId: string, members: MemberDto[]): Promise<{
        notFoundUserId: string[];
        alreadyMemberUserId: string[];
    }>;
    dismiss(user: User, projectId: string, members: MemberDto[]): Promise<{
        notFoundUserId: string[];
        alreadyNotMemberUserId: string[];
    }>;
    withdraw(user: User, projectId: string): Promise<void>;
    addCommment(user: User, projectId: string, content: string): Promise<void>;
    getAllComments(user: User, projectId: string, query: string): Promise<ProjectComment[]>;
    updateCommentContent(user: User, commentId: string, content: string): Promise<void>;
    updateCommentPinStatus(user: User, commentId: string, pinned: boolean): Promise<{
        pinnedStatus: boolean;
    }>;
    deleteComment(user: User, commentId: string): Promise<void>;
}
