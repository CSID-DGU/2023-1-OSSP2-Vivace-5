import { TaskRepository } from "./task.repository";
import { CreateTaskDto } from "./dto/create-task.dto";
import { User } from "src/entity/user.entity";
import { Task } from "src/entity/task.entity";
import { ProjectRepository } from "src/project/project.repository";
import { SubTask } from "src/enum/sub-task.enum";
import { AppendTaskDto } from "./dto/append-task.dto";
import { BringDownTaskDto } from "./dto/bring-down-task.dto";
import { UserRepository } from "src/user/user.repository";
import { DeleteTaskDto } from "./dto/delete-task.dto";
import { CreateContentDto, UpdateContentDto } from "./dto/create-content.dto";
import { TaskContentRepository } from "./content.repository";
import { UserToTaskRepository } from "./userToTask.repository";
export declare class TaskService {
    private taskRepository;
    private projectRepository;
    private userRepository;
    private contentRepository;
    private userToTaskRepository;
    constructor(taskRepository: TaskRepository, projectRepository: ProjectRepository, userRepository: UserRepository, contentRepository: TaskContentRepository, userToTaskRepository: UserToTaskRepository);
    getTaskInfo(user: User, taskId: string): Promise<Task>;
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
    updateFinishedStatus(user: User, taskId: string, isFinished: boolean): Promise<{
        isFinished: boolean;
    }>;
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
    deleteTask(user: User, deleteTaskDto: DeleteTaskDto): Promise<void>;
    createContent(user: User, taskId: string, createContentDto: CreateContentDto): Promise<{
        id: string;
        title: string;
        content: string;
        taskId: string;
    }>;
    getAllContents(user: User, taskId: string): Promise<{
        id: string;
        title: string;
        content: string;
        taskId: string;
    }>;
    updateContent(user: User, contentId: string, updateContentDto: UpdateContentDto): Promise<{
        id: string;
        title: string;
        content: string;
        taskId: string;
    }>;
    deleteContent(user: User, contentId: string): Promise<void>;
    createBookmark(user: User, taskId: string): Promise<{
        id: string;
        taskId: string;
    }>;
    deleteBookmark(user: User, taskId: string): Promise<void>;
    getAllBookmarks(user: User): Promise<Task[]>;
}
