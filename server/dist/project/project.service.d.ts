import { ProjectRepository } from "./project.repository";
import { User } from "src/entity/user.entity";
import { Project } from "../entity/project.entity";
import { ProjectInfoDto, MemberDto } from "./dto/project-info.dto";
import { UserToProjectRepository } from "./user-to-project.repository";
import { ProjectComment } from "src/entity/project-comment.entity";
import { ProjectCommentRepository } from "./project-comment.repository";
import { TaskRepository } from "src/task/task.repository";
import { UserRepository } from "src/user/user.repository";
import { ProjectContent } from "src/entity/project-content.entity";
import { ProjectContentRepository } from "./project-content.repository";
import { UpdateDocTitleDto } from "./dto/update-doc-title.dto";
import { UpdateDocContentDto } from "./dto/update-doc-content.dto";
export declare class ProjectService {
    private projectRepository;
    private userToProjectRepository;
    private projectCommentRepository;
    private taskRepository;
    private userRepository;
    private projectContentRepository;
    constructor(projectRepository: ProjectRepository, userToProjectRepository: UserToProjectRepository, projectCommentRepository: ProjectCommentRepository, taskRepository: TaskRepository, userRepository: UserRepository, projectContentRepository: ProjectContentRepository);
    getAllProjects(user: User, queryString: string): Promise<Record<string, any>[]>;
    getAllBookmarkedProjects(user: User, queryString: string): Promise<Project[]>;
    getProjectInfo(user: User, projectId: string): Promise<Record<string, any>>;
    createProject(user: User, projectInfoDto: ProjectInfoDto): Promise<{
        notFoundUserId: string[];
    }>;
    updateProject(user: User, projectId: string, projectInfoDto: ProjectInfoDto): Promise<{
        notFoundUserId: string[];
    }>;
    updateTitle(user: User, projectId: string, newTitle: string): Promise<void>;
    updateDescription(user: User, projectId: string, newDescription: string): Promise<void>;
    updateIcon(user: User, projectId: string, newIconBase64: string): Promise<void>;
    updateBookmarkStatus(user: User, projectId: string, bookmarkStatus: boolean): Promise<{
        bookmarkStatus: boolean;
    }>;
    deleteProject(user: User, projectId: string): Promise<void>;
    invite(user: User, projectId: string, members: MemberDto[]): Promise<{
        notFoundUserId: string[];
        alreadyMemberUserId: string[];
    }>;
    dismiss(user: User, projectId: string, members: string[]): Promise<{
        notFoundUserId: string[];
        alreadyNotMemberUserId: string[];
        adminUserId: string[];
    }>;
    withdraw(user: User, projectId: string): Promise<void>;
    addComment(user: User, projectId: string, content: string): Promise<void>;
    addReply(user: User, commentId: string, content: string): Promise<void>;
    getAllComments(user: User, projectId: string, queryString: string): Promise<{
        isQueried: boolean;
        queryResult: ProjectComment[];
    }>;
    updateCommentContent(user: User, commentId: string, content: string): Promise<void>;
    updateCommentFixStatus(user: User, commentId: string, pinned: boolean): Promise<{
        pinnedStatus: boolean;
    }>;
    getAllDocs(user: User, projectId: string): Promise<ProjectContent[]>;
    createDocument(user: User, projectId: string): Promise<void>;
    updateDocTitle(user: User, projectId: string, updateDocTitleDto: UpdateDocTitleDto): Promise<void>;
    updateDocContent(user: User, projectId: string, updateDocContentDto: UpdateDocContentDto): Promise<void>;
    deleteDocument(user: User, projectId: string, docId: string): Promise<void>;
    deleteComment(user: User, commentId: string): Promise<void>;
}
