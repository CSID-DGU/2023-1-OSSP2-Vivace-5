import { TaskService } from "./task.service";
import { User } from "src/entity/user.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { AppendTaskDto } from "./dto/append-task.dto";
import { BringDownTaskDto } from "./dto/bring-down-task.dto";
import { AppendColumnDto } from "./dto/append-column.dto";
import { MoveTaskBetweenColumnsDto } from "./dto/move-task-between-columns.dto";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { SubTask } from "src/enum/sub-task.enum";
import { Bookmark } from "src/entity/bookmark.entity";
export declare class TaskController {
    private taskService;
    private logger;
    constructor(taskService: TaskService);
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
    createColumn(user: User, taskId: string, columnTitle: string): void;
    createColumnInRoot(user: User, projectId: string, columnTitle: string): void;
    updateColumnTitle(user: User, columnId: string, newTitle: string): void;
    appendColumnBefore(user: User, appendColumnDto: AppendColumnDto): void;
    appendColumnAfter(user: User, appendColumnDto: AppendColumnDto): void;
    moveTaskBetweenColumns(user: User, moveTaskBetweenColumnsDto: MoveTaskBetweenColumnsDto): void;
    deleteColumn(user: User, columnId: string): void;
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
    getAllBookmarks(user: User, projectId: string): Promise<Bookmark[]>;
    createBookmark(user: User, createBookmarkDto: CreateBookmarkDto): Promise<void>;
    updateBookmarkTitle(user: User, bookmarkId: string, newTitle: string): Promise<void>;
    deleteBookmark(user: User, bookmarkId: string, cascading: boolean): Promise<void>;
    deleteBookmarkByTaskID(user: User, projectId: string, taskId: string): Promise<void>;
    getAllContents(user: User, taskId: string): Promise<import("../entity/task-content.entity").TaskContent[]>;
    createContent(user: User, taskId: string): Promise<void>;
    updateContent(user: User, contentId: string, content: string): void;
    deleteContent(user: User, contentId: string): void;
    getAllComments(user: User, taskId: string, query: string): void;
    createCommment(user: User, taskId: string, content: string): void;
    createReply(user: User, commentId: string, content: string): void;
    updateCommentContent(user: User, commentId: string, content: string): void;
    updateCommentPinStatus(user: User, commentId: string, pinned: boolean): void;
    deleteComment(user: User, commentId: string): void;
    deleteTask(user: User, taskId: string, cascading: boolean): Promise<void>;
}
