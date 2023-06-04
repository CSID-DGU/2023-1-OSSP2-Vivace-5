import {
    BadRequestException,
    Injectable,
    NotAcceptableException,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskRepository } from "./task.repository";
import { CreateTaskDto } from "./dto/create-task.dto";
import { User } from "src/entity/user.entity";
import { Task } from "src/entity/task.entity";
import { ProjectRepository } from "src/project/project.repository";
import { UserRight } from "src/enum/user-right.enum";
import { SubTask } from "src/enum/sub-task.enum";
import { AppendTaskDto } from "./dto/append-task.dto";
import { BringDownTaskDto } from "./dto/bring-down-task.dto";
import { UserRepository } from "src/user/user.repository";
import { DeleteTaskDto } from "./dto/delete-task.dto";
import { BookmarkRepository } from "./bookmark.repository";
import { KanbanColumnRepository } from "./kanban-column.repository";
import { KanbanColumn } from "src/entity/kanban-column.entity";

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
        @InjectRepository(ProjectRepository) private projectRepository: ProjectRepository,
        @InjectRepository(UserRepository) private userRepository: UserRepository,
        @InjectRepository(BookmarkRepository) private bookmarkRepository: BookmarkRepository,
        @InjectRepository(KanbanColumnRepository) private kanbanColumnRepository: KanbanColumnRepository,
    ) {}

    async getTaskInfo(user: User, taskId: string): Promise<Task> {
        const taskQuery = this.taskRepository.createQueryBuilder("task");

        taskQuery
            .select(["task", "members.id", "members.encodedImg"])
            .leftJoinAndSelect("task.project", "project")
            .leftJoinAndSelect("task.childColumns", "childColumns")
            .leftJoinAndSelect("task.parentColumn", "parentColumn")
            .leftJoinAndSelect("task.parent", "parent")
            .leftJoinAndSelect("task.children", "children")
            .leftJoinAndSelect("children.predecessors", "predecessors")
            .leftJoinAndSelect("children.successors", "successors")
            .leftJoin("task.members", "members")
            .leftJoinAndSelect("task.contents", "contents")
            .leftJoinAndSelect("task.comments", "comments")
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
                userId: user.id,
            })
            .leftJoinAndSelect("task.bookmarks", "bookmarks", "bookmarks.userId = :userId", { userId: user.id })
            .where("task.id = :taskId", { taskId });

        const found: Task = await taskQuery.getOne();

        if (!found) {
            throw new NotFoundException(`The task with id ${taskId} is not found.`);
        }

        if (!found.project.userToProjects[0]) {
            throw new UnauthorizedException(
                `The user ${user.email} is not member of this project with id ${found.project.id}`,
            );
        }

        return found;
    }

    async createTask(
        user: User,
        createTaskDto: CreateTaskDto,
    ): Promise<{
        id: string;
        title: string;
        description: string;
        type: SubTask;
    }> {
        const { projectId, parentId, isKanban, title, description, type, start, deadline } = createTaskDto;

        if (isKanban && !parentId) {
            throw new NotAcceptableException(`If the parent task is a Kanban board, the column id must be specified.`);
        }

        const projectQuery = this.projectRepository.createQueryBuilder("project");

        projectQuery.leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        });

        if (isKanban) {
            projectQuery
                .leftJoinAndSelect("project.columns", "columns", "columns.id = :parentId", { parentId })
                .leftJoinAndSelect("columns.parent", "parent");
        } else {
            projectQuery.leftJoinAndSelect("project.tasks", "tasks", "tasks.id = :parentId", { parentId });
        }

        projectQuery.where("project.id = :projectId", { projectId });

        const project = await projectQuery.getOne();

        if (!project) {
            throw new NotFoundException(`The project with id ${projectId} is not found.`);
        }

        if (!project.userToProjects[0]) {
            throw new UnauthorizedException(
                `The user ${user.email} is not member of this project with id ${projectId}`,
            );
        }

        if (
            project.userToProjects[0].right === UserRight.COMPLETION_MOD ||
            project.userToProjects[0].right === UserRight.MEMBER_MGT
        ) {
            throw new UnauthorizedException(
                `The user ${user.email} has insufficient permissions in this project with id ${projectId}`,
            );
        }

        let last: Task = null;

        if (parentId) {
            if (isKanban) {
                if (!project.columns[0]) {
                    throw new NotFoundException(
                        `The column with id ${parentId} is not found in this project with id ${projectId}.`,
                    );
                }

                const columnTaskQuery = this.taskRepository.createQueryBuilder("task");

                columnTaskQuery
                    .leftJoin("task.successors", "successors")
                    .where("task.parentColumnId = :parentId", { parentId })
                    .having("COUNT(successors) = :count", { count: 0 });

                last = await columnTaskQuery.getOne();
            } else {
                if (!project.tasks[0]) {
                    throw new NotFoundException(
                        `The parent task with id ${parentId} is not found in this project with id ${projectId}.`,
                    );
                }

                if (project.tasks[0].type === SubTask.KANBAN) {
                    throw new BadRequestException(
                        `The parent task with id ${parentId} cannot be the type of kanban board.`,
                    );
                }

                if (project.tasks[0].type === SubTask.TERMINAL) {
                    throw new BadRequestException(`Cannot create sub-task under terminal type task.`);
                }

                if (project.tasks[0].type === SubTask.LIST) {
                    const lastTaskQuery = this.taskRepository.createQueryBuilder("task");

                    lastTaskQuery
                        .leftJoin("task.successors", "successors")
                        .where("task.parentId = :parentId", { parentId })
                        .having("COUNT(successors) = :count", { count: 0 });

                    last = await lastTaskQuery.getOne();
                }
            }
        } else {
            if (project.type === SubTask.TERMINAL || project.type === SubTask.KANBAN) {
                throw new BadRequestException(`Cannot create task under terminal type project.`);
            }
        }

        const now = new Date();
        const newTask: Task = new Task();

        newTask.title = title;
        newTask.description = description;
        newTask.type = type;
        newTask.milestone = false;
        newTask.createdAt = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds(),
            ),
        );
        newTask.start = start;
        newTask.deadline = deadline;
        newTask.isFinished = false;

        if (!isKanban && parentId) {
            newTask.parent = project.tasks[0];
            if (project.tasks[0].type === SubTask.LIST) {
                newTask.predecessors = [last];
            }
        }

        if (isKanban) {
            newTask.parentColumn = project.columns[0];

            if (last) {
                newTask.predecessors = [last];
            }

            if (project.columns[0].parent) {
                newTask.parent = project.columns[0].parent;
            }
        }

        newTask.project = project;

        await this.taskRepository.save(newTask);

        return {
            id: newTask.id,
            title,
            description,
            type,
        };
    }

    async updateTitle(user: User, taskId: string, newTitle: string): Promise<void> {
        const found = await this.taskRepository.getTaskforUpdate(user, taskId);

        found.title = newTitle;

        await this.taskRepository.save(found);
    }

    async updateDescription(user: User, taskId: string, newDescription: string): Promise<void> {
        const found = await this.taskRepository.getTaskforUpdate(user, taskId);

        found.description = newDescription;

        await this.taskRepository.save(found);
    }

    async updateStart(user: User, taskId: string, newStart: Date): Promise<void> {
        const found = await this.taskRepository.getTaskforUpdate(user, taskId);

        found.start = newStart;

        await this.taskRepository.save(found);
    }

    async updateDeadline(user: User, taskId: string, newDeadline: Date): Promise<void> {
        const found = await this.taskRepository.getTaskforUpdate(user, taskId);

        found.deadline = newDeadline;

        await this.taskRepository.save(found);
    }

    async updateMilestoneStatus(user: User, taskId: string, milestone: boolean): Promise<{ milestone: boolean }> {
        const found = await this.taskRepository.getTaskforUpdate(user, taskId);

        found.milestone = milestone;

        await this.taskRepository.save(found);

        return { milestone };
    }

    async updateFinishedStatus(user: User, taskId: string, isFinished: boolean): Promise<{ isFinished: boolean }> {
        const taskQuery = this.taskRepository.createQueryBuilder("task");

        taskQuery
            .leftJoinAndSelect("task.members", "members", "members.id = :userId", { userId: user.id })
            .where("task.id = :taskId", { taskId });

        const found: Task = await taskQuery.getOne();

        if (!found) {
            throw new NotFoundException(`The task with id ${taskId} is not found.`);
        }

        if (!found.members[0]) {
            throw new UnauthorizedException(`The user ${user.email} is not member of task ${taskId}`);
        }

        found.isFinished = isFinished;

        await this.taskRepository.save(found);

        return { isFinished };
    }

    async createColumn(user: User, taskId: string, columnTitle: string): Promise<KanbanColumn> {
        return null;
    }

    async appendTaskBefore(
        user: User,
        appendTaskDto: AppendTaskDto,
    ): Promise<{
        taskId: string;
        appendedTaskIds: string[];
        notFoundTaskIds: string[];
        differentParentTaskIds: string[];
        alreadyPredecessorIds: string[];
    }> {
        const { taskId, taskIdsToAppend } = appendTaskDto;

        const taskQuery = this.taskRepository.createQueryBuilder("task");

        taskQuery
            .select(["task.id"])
            .leftJoin("task.parent", "parent")
            .addSelect(["parent.id", "parent.type"])
            .leftJoin("task.project", "project")
            .addSelect(["project.id", "project.type"])
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
                userId: user.id,
            })
            .leftJoinAndSelect("task.predecessors", "predecessors")
            .where("task.id = :taskId", { taskId });

        const task: Task = await taskQuery.getOne();

        if (!task) {
            throw new NotFoundException(`The task with id ${taskId} is not found.`);
        }

        if (!task.project.userToProjects[0]) {
            throw new UnauthorizedException(
                `User ${user.email} is not member of this project with id ${task.project.id}`,
            );
        }

        if (
            task.project.userToProjects[0].right === UserRight.COMPLETION_MOD ||
            task.project.userToProjects[0].right === UserRight.MEMBER_MGT
        ) {
            throw new UnauthorizedException(
                `User ${user.email} has insufficient permission to update tasks in this project with id ${task.project.id}. Your permission is ${task.project.userToProjects[0].right}.`,
            );
        }

        const appendedTasks = [] as Task[];
        const appendedTaskIds = [] as string[];
        const notFoundTaskIds = [] as string[];
        const differentParentTaskIds = [] as string[];
        const alreadyPredecessorIds = [] as string[];

        for (const taskIdToAppend of taskIdsToAppend) {
            const taskToAppendQuery = this.taskRepository.createQueryBuilder("task");

            taskToAppendQuery
                .select(["task.id"])
                .leftJoin("task.parent", "parent")
                .addSelect(["parent.id"])
                .leftJoin("task.project", "project")
                .addSelect(["project.id"])
                .leftJoinAndSelect("task.predecessors", "predecessors")
                .leftJoinAndSelect("task.successors", "successors")
                .where("task.id = :taskId", { taskId: taskIdToAppend });

            const taskToAppend: Task = await taskToAppendQuery.getOne();

            if (!taskToAppend) {
                notFoundTaskIds.push(taskIdToAppend);
                continue;
            }

            if (task.parent && taskToAppend.parent) {
                if (task.parent.id !== taskToAppend.parent.id) {
                    differentParentTaskIds.push(taskIdToAppend);
                    continue;
                }
            } else if (!task.parent && !taskToAppend.parent) {
                if (task.project.id !== taskToAppend.project.id) {
                    differentParentTaskIds.push(taskIdToAppend);
                    continue;
                }
            } else {
                differentParentTaskIds.push(taskIdToAppend);
                continue;
            }

            for (const predecessor of task.predecessors) {
                if (predecessor.id === taskIdToAppend) {
                    alreadyPredecessorIds.push(taskIdToAppend);
                    continue;
                }
            }

            appendedTasks.push(taskToAppend);
            appendedTaskIds.push(taskIdToAppend);
        }

        if (
            (task.parent && task.parent.type === SubTask.GRAPH) ||
            (!task.parent && task.project.type === SubTask.GRAPH)
        ) {
            for (const appendedTask of appendedTasks) {
                task.predecessors.push(appendedTask);
            }
        } else if (appendedTasks[0]) {
            const appendedTask: Task = appendedTasks[0];

            appendedTask.predecessors = [];
            appendedTask.successors = [];

            await this.taskRepository.save(appendedTask);

            if (task.predecessors[0]) {
                task.predecessors[0].successors = [appendedTask];

                await this.taskRepository.save(task.predecessors[0]);
            }

            task.predecessors = [appendedTask];
        }

        await this.taskRepository.save(task);

        return { taskId, appendedTaskIds, notFoundTaskIds, differentParentTaskIds, alreadyPredecessorIds };
    }

    async appendTaskAfter(
        user: User,
        appendTaskDto: AppendTaskDto,
    ): Promise<{
        taskId: string;
        appendedTaskIds: string[];
        notFoundTaskIds: string[];
        differentParentTaskIds: string[];
        alreadyPredecessorIds: string[];
    }> {
        const { taskId, taskIdsToAppend } = appendTaskDto;

        const taskQuery = this.taskRepository.createQueryBuilder("task");

        taskQuery
            .select(["task.id"])
            .leftJoin("task.parent", "parent")
            .addSelect(["parent.id", "parent.type"])
            .leftJoin("task.project", "project")
            .addSelect(["project.id", "project.type"])
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
                userId: user.id,
            })
            .leftJoinAndSelect("task.successors", "successors")
            .where("task.id = :taskId", { taskId });

        const task: Task = await taskQuery.getOne();

        if (!task) {
            throw new NotFoundException(`The task with id ${taskId} is not found.`);
        }

        if (!task.project.userToProjects[0]) {
            throw new UnauthorizedException(
                `User ${user.email} is not member of this project with id ${task.project.id}`,
            );
        }

        if (
            task.project.userToProjects[0].right === UserRight.COMPLETION_MOD ||
            task.project.userToProjects[0].right === UserRight.MEMBER_MGT
        ) {
            throw new UnauthorizedException(
                `User ${user.email} has insufficient permission to update tasks in this project with id ${task.project.id}. Your permission is ${task.project.userToProjects[0].right}.`,
            );
        }

        const appendedTasks = [] as Task[];
        const appendedTaskIds = [] as string[];
        const notFoundTaskIds = [] as string[];
        const differentParentTaskIds = [] as string[];
        const alreadyPredecessorIds = [] as string[];

        for (const taskIdToAppend of taskIdsToAppend) {
            const taskToAppendQuery = this.taskRepository.createQueryBuilder("task");

            taskToAppendQuery
                .select(["task.id"])
                .leftJoin("task.parent", "parent")
                .addSelect(["parent.id"])
                .leftJoin("task.project", "project")
                .addSelect(["project.id"])
                .leftJoinAndSelect("task.predecessors", "predecessors")
                .leftJoinAndSelect("task.successors", "successors")
                .where("task.id = :taskId", { taskId: taskIdToAppend });

            const taskToAppend: Task = await taskToAppendQuery.getOne();

            if (!taskToAppend) {
                notFoundTaskIds.push(taskIdToAppend);
                continue;
            }

            if (task.parent && taskToAppend.parent) {
                if (task.parent.id !== taskToAppend.parent.id) {
                    differentParentTaskIds.push(taskIdToAppend);
                    continue;
                }
            } else if (!task.parent && !taskToAppend.parent) {
                if (task.project.id !== taskToAppend.project.id) {
                    differentParentTaskIds.push(taskIdToAppend);
                    continue;
                }
            } else {
                differentParentTaskIds.push(taskIdToAppend);
                continue;
            }

            for (const successor of task.successors) {
                if (successor.id === taskIdToAppend) {
                    alreadyPredecessorIds.push(taskIdToAppend);
                    continue;
                }
            }

            appendedTasks.push(taskToAppend);
            appendedTaskIds.push(taskIdToAppend);
        }

        if (
            (task.parent && task.parent.type === SubTask.GRAPH) ||
            (!task.parent && task.project.type === SubTask.GRAPH)
        ) {
            for (const appendedTask of appendedTasks) {
                task.successors.push(appendedTask);
            }
        } else if (appendedTasks[0]) {
            const appendedTask: Task = appendedTasks[0];

            appendedTask.predecessors = [];
            appendedTask.successors = [];

            await this.taskRepository.save(appendedTask);

            if (task.successors[0]) {
                task.successors[0].predecessors = [appendedTask];

                await this.taskRepository.save(task.successors[0]);
            }

            task.successors = [appendedTask];
        }

        await this.taskRepository.save(task);

        return { taskId, appendedTaskIds, notFoundTaskIds, differentParentTaskIds, alreadyPredecessorIds };
    }

    async bringDownTask(user: User, bringDownDto: BringDownTaskDto): Promise<void> {
        const { taskId, taskIdToParent } = bringDownDto;

        const taskQuery = this.taskRepository.createQueryBuilder("task");

        taskQuery
            .select(["task.id"])
            .leftJoin("task.parent", "parent")
            .addSelect(["parent.id"])
            .leftJoin("task.project", "project")
            .addSelect(["project.id"])
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
                userId: user.id,
            })
            .leftJoinAndSelect("task.successors", "successors")
            .leftJoinAndSelect("task.predecessors", "predecessors")
            .where("task.id = :taskId", { taskId });

        const task: Task = await taskQuery.getOne();

        if (!task) {
            throw new NotFoundException(`The task with id ${taskId} is not found.`);
        }

        if (!task.project.userToProjects[0]) {
            throw new UnauthorizedException(
                `User ${user.email} is not member of this project with id ${task.project.id}`,
            );
        }

        if (
            task.project.userToProjects[0].right === UserRight.COMPLETION_MOD ||
            task.project.userToProjects[0].right === UserRight.MEMBER_MGT
        ) {
            throw new UnauthorizedException(
                `User ${user.email} has insufficient permission to bring down task in this project with id ${task.project.id}. Your permission is ${task.project.userToProjects[0].right}.`,
            );
        }

        const taskToParentQuery = this.taskRepository.createQueryBuilder("task");

        taskToParentQuery
            .leftJoin("task.parent", "parent")
            .addSelect(["parent.id"])
            .leftJoin("task.project", "project")
            .addSelect(["project.id"])
            .leftJoinAndSelect("task.children", "children")
            .where("task.id = :taskId", { taskId: taskIdToParent });

        const taskToParent: Task = await taskToParentQuery.getOne();

        if (!taskToParent) {
            throw new NotFoundException(`The task with id ${taskIdToParent} is not found.`);
        }

        if (task.parent && taskToParent.parent) {
            if (task.parent.id !== taskToParent.parent.id) {
                throw new BadRequestException(`Task ${taskId} and Task ${taskIdToParent} has a different parent.`);
            }
        } else if (!task.parent && !taskToParent.parent) {
            if (task.project.id !== taskToParent.project.id) {
                throw new BadRequestException(
                    `Task ${taskId} and Task ${taskIdToParent} are included in a different project.`,
                );
            }
        } else {
            throw new BadRequestException(`Task ${taskId} and Task ${taskIdToParent} has a different parent.`);
        }

        if (taskToParent.type === SubTask.TERMINAL) {
            throw new BadRequestException(`Task ${taskIdToParent} is terminal task.`);
        } else if (taskToParent.type === SubTask.GRAPH) {
            task.predecessors = [] as Task[];
            task.successors = [] as Task[];
            task.parent = taskToParent;
        } else if (taskToParent.type === SubTask.LIST) {
            const lastTaskQuery = this.taskRepository.createQueryBuilder("task");

            lastTaskQuery
                .leftJoin("task.successors", "successors")
                .where("task.parentId = :parentId", { parentId: taskIdToParent })
                .having("COUNT(successors) = :count", { count: 0 });

            const last: Task = await lastTaskQuery.getOne();

            if (last) {
                task.predecessors = [last];
            } else {
                task.predecessors = [] as Task[];
            }
            task.successors = [] as Task[];
            task.parent = taskToParent;
        } else {
            const firstColumnQuery = this.kanbanColumnRepository.createQueryBuilder("column");

            firstColumnQuery
                .leftJoin("column.predecessor", "predecessor")
                .leftJoinAndSelect("column.children", "children")
                .leftJoinAndSelect("children.successors", "successors")
                .where("column.parentId = :parentId", { parentId: taskIdToParent })
                .andWhere("predecessor IS NULL");

            const firstColumn: KanbanColumn = await firstColumnQuery.getOne();

            let last: Task = null;
            for (const columnTask of firstColumn.children) {
                if (columnTask.successors.length === 0) {
                    last = columnTask;
                }
            }

            if (last) {
                task.predecessors = [last];
            } else {
                task.predecessors = [] as Task[];
            }

            task.successors = [] as Task[];
            task.parent = taskToParent;

            if (firstColumn) {
                task.parentColumn = firstColumn;
            } else {
                const createdColumn = await this.createColumn(user, taskToParent.id, "Untitled");

                task.parentColumn = createdColumn;
            }
        }

        await this.taskRepository.save(task);
    }

    async bringUpTask(user: User, taskId: string): Promise<void> {
        const taskQuery = this.taskRepository.createQueryBuilder("task");

        taskQuery
            .leftJoinAndSelect("task.parent", "parent")
            .leftJoinAndSelect("parent.parent", "grandparent")
            .leftJoin("task.project", "project")
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
                userId: user.id,
            })
            .leftJoinAndSelect("task.successors", "successors")
            .leftJoinAndSelect("task.predecessors", "predecessors")
            .where("task.id = :taskId", { taskId });

        const task: Task = await taskQuery.getOne();

        if (!task) {
            throw new NotFoundException(`The task with id ${taskId} is not found.`);
        }

        if (!task.project.userToProjects[0]) {
            throw new UnauthorizedException(
                `User ${user.email} is not member of this project with id ${task.project.id}`,
            );
        }

        if (
            task.project.userToProjects[0].right === UserRight.COMPLETION_MOD ||
            task.project.userToProjects[0].right === UserRight.MEMBER_MGT
        ) {
            throw new UnauthorizedException(
                `User ${user.email} has insufficient permission to bring up task in this project with id ${task.project.id}. Your permission is ${task.project.userToProjects[0].right}.`,
            );
        }

        if (!task.parent) {
            throw new BadRequestException(`Task ${taskId} is a root task of the project ${task.project.id}`);
        }

        let type: SubTask = SubTask.TERMINAL;

        if (!task.parent.parent) {
            task.parent = null;
            type = task.project.type;
        } else {
            task.parent = task.parent.parent;
            type = task.parent.parent.type;
        }

        if (type === SubTask.GRAPH) {
            task.predecessors = [] as Task[];
            task.successors = [] as Task[];
            task.parentColumn = null;
        } else if (type === SubTask.LIST) {
            const lastTaskQuery = this.taskRepository.createQueryBuilder("task");

            lastTaskQuery.leftJoin("task.successors", "successors").having("COUNT(successors) = :count", { count: 0 });

            if (!task.parent.parent) {
                lastTaskQuery
                    .where("task.parent IS NULL")
                    .andWhere("task.projectId = :projectId", { projectId: task.project.id });
            } else {
                lastTaskQuery.where("task.parentId = :parentId", { parentId: task.parent.parent.id });
            }

            const last: Task = await lastTaskQuery.getOne();

            if (last) {
                task.predecessors = [last];
            } else {
                task.predecessors = [] as Task[];
            }

            task.successors = [] as Task[];
            task.parentColumn = null;
        } else if (type === SubTask.KANBAN) {
            const firstColumnQuery = this.kanbanColumnRepository.createQueryBuilder("column");

            firstColumnQuery
                .leftJoin("column.predecessor", "predecessor")
                .leftJoinAndSelect("column.children", "children")
                .leftJoinAndSelect("children.successors", "successors")
                .where("predecessor IS NULL");

            if (!task.parent.parent) {
                firstColumnQuery
                    .andWhere("column.parent IS NULL")
                    .andWhere("column.projectId = :projectId", { projectId: task.project.id });
            } else {
                firstColumnQuery.andWhere("column.parentId = :parentId", { parentId: task.parent.parent.id });
            }

            const firstColumn: KanbanColumn = await firstColumnQuery.getOne();

            let last: Task = null;
            for (const columnTask of firstColumn.children) {
                if (columnTask.successors.length === 0) {
                    last = columnTask;
                }
            }

            if (last) {
                task.predecessors = [last];
            } else {
                task.predecessors = [] as Task[];
            }

            task.successors = [] as Task[];
            task.parentColumn = firstColumn;
        } else {
            // type === TERMINAL
            throw new BadRequestException(
                `The parent of parent task ${task.parent.parent.id} cannot be terminal task.`,
            );
        }

        await this.taskRepository.save(task);
    }

    async invite(
        user: User,
        taskId: string,
        memberIds: string[],
    ): Promise<{
        memberIds: string[];
        addedMemberIds: string[];
        notFoundUserIds: string[];
        notProjectMemberIds: string[];
        alreadyTaskMemberIds: string[];
    }> {
        const taskQuery = this.taskRepository.createQueryBuilder("task");

        taskQuery
            .select(["task.id"])
            .leftJoin("task.project", "project")
            .addSelect(["project.id"])
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
                userId: user.id,
            })
            .where("task.id = :taskId", { taskId });

        const task: Task = await taskQuery.getOne();

        if (!task) {
            throw new NotFoundException(`The task with id ${taskId} is not found.`);
        }

        if (!task.project.userToProjects[0]) {
            throw new UnauthorizedException(
                `User ${user.email} is not member of this project with id ${task.project.id}`,
            );
        }

        if (
            task.project.userToProjects[0].right === UserRight.COMPLETION_MOD ||
            task.project.userToProjects[0].right === UserRight.TASK_MGT
        ) {
            throw new UnauthorizedException(
                `User ${user.email} has insufficient permission to invite members to task ${taskId} in this project with id ${task.project.id}. Your permission is ${task.project.userToProjects[0].right}.`,
            );
        }

        const addedMemberIds = [] as string[];
        const notFoundUserIds = [] as string[];
        const notProjectMemberIds = [] as string[];
        const alreadyTaskMemberIds = [] as string[];

        for (const memberId of memberIds) {
            const userQuery = this.userRepository.createQueryBuilder("user");

            userQuery
                .leftJoinAndSelect("user.userToProjects", "userToProjects", "userToProjects.projectId = :projectId", {
                    projectId: task.project.id,
                })
                .leftJoinAndSelect("user.tasks", "tasks", "tasks.id = :taskId", { taskId })
                .where("user.id = :memberId", { memberId });

            const foundUser: User = await userQuery.getOne();

            if (!foundUser) {
                notFoundUserIds.push(memberId);
                continue;
            }

            if (!foundUser.userToProjects[0]) {
                notProjectMemberIds.push(memberId);
                continue;
            }

            if (foundUser.tasks[0]) {
                alreadyTaskMemberIds.push(memberId);
                continue;
            }

            const ancestorsQuery = this.taskRepository.createAncestorsQueryBuilder("task", "taskClosure", task);

            ancestorsQuery.leftJoinAndSelect("task.members", "members");

            const ancestors: Task[] = await ancestorsQuery.getMany();

            for (const ancestor of ancestors) {
                for (const member of ancestor.members) {
                    if (member.id === memberId) {
                        continue;
                    }
                }

                ancestor.members.push(foundUser);
                await this.taskRepository.save(ancestor);
            }

            addedMemberIds.push(memberId);
        }

        return { memberIds, addedMemberIds, notFoundUserIds, notProjectMemberIds, alreadyTaskMemberIds };
    }

    async dismiss(
        user: User,
        taskId: string,
        memberIds: string[],
    ): Promise<{
        memberIds: string[];
        deletedMemberIds: string[];
        notFoundUserIds: string[];
        alreadyNotTaskMemberIds: string[];
    }> {
        const taskQuery = this.taskRepository.createQueryBuilder("task");

        taskQuery
            .select(["task.id"])
            .leftJoin("task.project", "project")
            .addSelect(["project.id"])
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
                userId: user.id,
            })
            .where("task.id = :taskId", { taskId });

        const task: Task = await taskQuery.getOne();

        if (!task) {
            throw new NotFoundException(`The task with id ${taskId} is not found.`);
        }

        if (!task.project.userToProjects[0]) {
            throw new UnauthorizedException(
                `User ${user.email} is not member of this project with id ${task.project.id}`,
            );
        }

        if (
            task.project.userToProjects[0].right === UserRight.COMPLETION_MOD ||
            task.project.userToProjects[0].right === UserRight.TASK_MGT
        ) {
            throw new UnauthorizedException(
                `User ${user.email} has insufficient permission to invite members to task ${taskId} in this project with id ${task.project.id}. Your permission is ${task.project.userToProjects[0].right}.`,
            );
        }

        const deletedMemberIds = [] as string[];
        const notFoundUserIds = [] as string[];
        const alreadyNotTaskMemberIds = [] as string[];

        for (const memberId of memberIds) {
            const userQuery = this.userRepository.createQueryBuilder("user");

            userQuery
                .leftJoinAndSelect("user.tasks", "tasks", "tasks.id = :taskId", { taskId })
                .where("user.id = :memberId", { memberId });

            const foundUser: User = await userQuery.getOne();

            if (!foundUser) {
                notFoundUserIds.push(memberId);
                continue;
            }

            if (!foundUser.tasks[0]) {
                alreadyNotTaskMemberIds.push(memberId);
                continue;
            }

            const descendants: Task[] = await this.taskRepository.findDescendants(task, { relations: ["members"] });

            for (const descendant of descendants) {
                descendant.members = descendant.members.filter((member) => member.id !== memberId);
                await this.taskRepository.save(descendant);
            }

            deletedMemberIds.push(memberId);
        }

        return { memberIds, deletedMemberIds, notFoundUserIds, alreadyNotTaskMemberIds };
    }

    async deleteTask(user: User, deleteTaskDto: DeleteTaskDto): Promise<void> {
        const { taskId, cascading } = deleteTaskDto;

        const taskQuery = this.taskRepository.createQueryBuilder("task");

        taskQuery
            .leftJoin("task.parent", "parent")
            .leftJoin("task.project", "project")
            .addSelect(["project.id", "project.type"])
            .leftJoinAndSelect("task.children", "children")
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
                userId: user.id,
            })
            .where("task.id = :taskId", { taskId });

        const task: Task = await taskQuery.getOne();

        if (!task) {
            throw new NotFoundException(`The task with id ${taskId} is not found.`);
        }

        if (!task.project.userToProjects[0]) {
            throw new UnauthorizedException(
                `User ${user.email} is not member of this project with id ${task.project.id}`,
            );
        }

        if (
            task.project.userToProjects[0].right === UserRight.COMPLETION_MOD ||
            task.project.userToProjects[0].right === UserRight.MEMBER_MGT
        ) {
            throw new UnauthorizedException(
                `User ${user.email} has insufficient permission to delete task ${taskId} in this project with id ${task.project.id}. Your permission is ${task.project.userToProjects[0].right}.`,
            );
        }

        if (!cascading) {
            for (const child of task.children) {
                this.bringUpTask(user, child.id);
            }
        }

        await this.taskRepository.findDescendants(task);
        await this.taskRepository.delete({ id: taskId });
    }

    private fixHole(task: Task) {
        let type: SubTask = SubTask.TERMINAL;

        if (task.parent) {
            type = task.parent.type;
        } else {
            type = task.project.type;
        }
    }
}
