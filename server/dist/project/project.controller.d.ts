import { ProjectService } from "./project.service";
import { User } from "src/entity/user.entity";
import { MemberDto, ProjectInfoDto } from "./dto/project-info.dto";
import { ProjectComment } from "src/entity/project-comment.entity";
import { ProjectContent } from "src/entity/project-content.entity";
import { UpdateDocTitleDto } from "./dto/update-doc-title.dto";
import { UpdateDocContentDto } from "./dto/update-doc-content.dto";
export declare class ProjectController {
    private projectService;
    private logger;
    constructor(projectService: ProjectService);
    getAllProjects(user: User, query: string): Promise<Record<string, any>[]>;
    getAllBookmarkedProjects(user: User, query: string): Promise<Record<string, any>[]>;
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
    addCommment(user: User, projectId: string, content: string): Promise<void>;
    addReply(user: User, commentId: string, content: string): Promise<void>;
    getAllComments(user: User, projectId: string, query: string): Promise<{
        isQueried: boolean;
        queryResult: ProjectComment[];
    }>;
    updateCommentContent(user: User, commentId: string, content: string): Promise<void>;
    updateCommentPinStatus(user: User, commentId: string, pinned: boolean): Promise<{
        pinnedStatus: boolean;
    }>;
    getAllDocs(user: User, projectId: string): Promise<ProjectContent[]>;
    createDocument(user: User, projectId: string): Promise<void>;
    updateDocTitle(user: User, projectId: string, updateDocTitleDto: UpdateDocTitleDto): Promise<void>;
    updateDocContent(user: User, projectId: string, updateDocContentDto: UpdateDocContentDto): Promise<void>;
    deleteDocument(user: User, projectId: string, docId: string): Promise<void>;
    deleteComment(user: User, commentId: string): Promise<void>;
}
