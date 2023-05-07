import { ProjectRepository } from "./project.repository";
import { User } from "src/entity/user.entity";
import { Project } from "../entity/project.entity";
import { ProjectInfoDto, MemberDto } from "./dto/project-info.dto";
import { UserService } from "src/user/user.service";
import { UserToProjectRepository } from "./user-to-project.repository";
import { ProjectComment } from "src/entity/project-comment.entity";
import { ProjectCommentRepository } from "./project-comment.repository";
export declare class ProjectService {
    private projectRepository;
    private userToProjectRepository;
    private projectCommentRepository;
    private userService;
    constructor(projectRepository: ProjectRepository, userToProjectRepository: UserToProjectRepository, projectCommentRepository: ProjectCommentRepository, userService: UserService);
    getAllProjects(user: User, queryString: string): Promise<Project[]>;
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
    addComment(user: User, projectId: string, content: string): Promise<void>;
    getAllComments(user: User, projectId: string, queryString: string): Promise<ProjectComment[]>;
    updateCommentContent(user: User, commentId: string, content: string): Promise<void>;
    updateCommentFixStatus(user: User, commentId: string, pinned: boolean): Promise<{
        pinnedStatus: boolean;
    }>;
    deleteComment(user: User, commentId: string): Promise<void>;
}
