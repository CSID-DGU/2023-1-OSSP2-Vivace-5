import { TaskRepository } from "./task.repository";
import { CreateTaskDto } from "./dto/create-task.dto";
import { User } from "src/entity/user.entity";
import { ProjectRepository } from "src/project/project.repository";
import { SubTask } from "src/enum/sub-task.enum";
import { AppendTaskDto } from "./dto/append-task.dto";
import { BringDownTaskDto } from "./dto/bring-down-task.dto";
import { UserRepository } from "src/user/user.repository";
import { BookmarkRepository } from "./bookmark.repository";
import { KanbanColumnRepository } from "./kanban-column.repository";
import { KanbanColumn } from "src/entity/kanban-column.entity";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { Bookmark } from "src/entity/bookmark.entity";
import { TaskContentRepository } from "./task-content.repository";
import { TaskContent } from "src/entity/task-content.entity";
export declare class TaskService {
    private taskRepository;
    private projectRepository;
    private userRepository;
    private bookmarkRepository;
    private kanbanColumnRepository;
    private taskContentRepository;
    constructor(taskRepository: TaskRepository, projectRepository: ProjectRepository, userRepository: UserRepository, bookmarkRepository: BookmarkRepository, kanbanColumnRepository: KanbanColumnRepository, taskContentRepository: TaskContentRepository);
    getTaskInfo(user: User, taskId: string): Promise<Record<string, any>>;
    createTask(user: User, createTaskDto: CreateTaskDto): Promise<{
        id: string;
        title: string;
        description: string;
        type: SubTask;
    }>;
    updateTitle(user: User, taskId: string, newTitle: string): Promise<void>;
    updateDescription(user: User, taskId: string, newDescription: string): Promise<void>;
    updateStart(user: User, taskId: string, newStart: Date): Promise<void>;
    updateDeadline(user: User, taskId: string, newDeadline: Date): Promise<void>;
    updateMilestoneStatus(user: User, taskId: string, milestone: boolean): Promise<{
        milestone: boolean;
    }>;
    updateDescendantFinishedStatus(user: User, taskId: string, isFinished: boolean): Promise<{
        isFinished: boolean;
    }>;
    updateFinishedStatus(user: User, taskId: string, isFinished: boolean): Promise<{
        isFinished: boolean;
    }>;
    createColumn(user: User, taskId: string, columnTitle: string): Promise<KanbanColumn>;
    appendTaskBefore(user: User, appendTaskDto: AppendTaskDto): Promise<{
        taskId: string;
        appendedTaskIds: string[];
        notFoundTaskIds: string[];
        differentParentTaskIds: string[];
        alreadyPredecessorIds: string[];
    }>;
    appendTaskAfter(user: User, appendTaskDto: AppendTaskDto): Promise<{
        taskId: string;
        appendedTaskIds: string[];
        notFoundTaskIds: string[];
        differentParentTaskIds: string[];
        alreadyPredecessorIds: string[];
    }>;
    disconnect(user: User, appendTaskDto: AppendTaskDto): Promise<void>;
    bringDownTask(user: User, bringDownDto: BringDownTaskDto): Promise<void>;
    bringUpTask(user: User, taskId: string): Promise<void>;
    invite(user: User, taskId: string, memberIds: string[]): Promise<{
        memberIds: string[];
        addedMemberIds: string[];
        notFoundUserIds: string[];
        notProjectMemberIds: string[];
        alreadyTaskMemberIds: string[];
    }>;
    dismiss(user: User, taskId: string, memberIds: string[]): Promise<{
        memberIds: string[];
        deletedMemberIds: string[];
        notFoundUserIds: string[];
        alreadyNotTaskMemberIds: string[];
    }>;
    getAllContents(user: User, taskId: string): Promise<TaskContent[]>;
    createContent(user: User, taskId: string): Promise<void>;
    getAllBookmarks(user: User, projectId: string): Promise<Bookmark[]>;
    updateBookmarkTitle(user: User, bookmarkId: string, newTitle: string): Promise<void>;
    createBookmark(user: User, createBookmarkDto: CreateBookmarkDto): Promise<void>;
    deleteBookmark(user: User, bookmarkId: string, cascading: boolean): Promise<void>;
    deleteBookmarkByTaskID(user: User, projectId: string, taskId: string): Promise<void>;
    deleteTask(user: User, taskId: string, cascading: boolean): Promise<void>;
}
