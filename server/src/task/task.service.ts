import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
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
import { CreateContentDto, UpdateContentDto } from "./dto/create-content.dto";
import { TaskContentRepository } from "./content.repository";
import { TaskContent } from "src/entity/task-content.entity";
import { UserToTaskRepository } from "./userToTask.repository";
import { FindManyOptions, FindOneOptions } from "typeorm";
import { UserToTask } from "src/entity/user-to-task.entity";

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
        @InjectRepository(ProjectRepository) private projectRepository: ProjectRepository,
        @InjectRepository(UserRepository) private userRepository: UserRepository,
        @InjectRepository(TaskContentRepository) private contentRepository: TaskContentRepository,
        @InjectRepository(UserToTaskRepository) private userToTaskRepository: UserToTaskRepository,
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
            throw new BadRequestException(`If the parent task is a Kanban board, the column id must be specified.`);
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
                    .where("task.parentColumnId = :parentId", { parentId })
                    .andWhere("task.successors IS NULL");

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

                if (project.type === SubTask.TERMINAL) {
                    throw new BadRequestException(`Cannot create sub-task under terminal type task.`);
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
            .select(["task.id"])
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

        task.predecessors = [] as Task[];
        task.successors = [] as Task[];
        task.parent = taskToParent;

        await this.taskRepository.save(task);
    }

    async bringUpTask(user: User, taskId: string): Promise<void> {
        const taskQuery = this.taskRepository.createQueryBuilder("task");

        taskQuery
            .select(["task.id"])
            .leftJoinAndSelect("task.parent", "parent")
            .leftJoinAndSelect("parent.parent", "grandparent")
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
                `User ${user.email} has insufficient permission to bring up task in this project with id ${task.project.id}. Your permission is ${task.project.userToProjects[0].right}.`,
            );
        }

        if (!task.parent) {
            throw new BadRequestException(`Task ${taskId} is a root task of the project ${task.project.id}`);
        }

        task.predecessors = [] as Task[];
        task.successors = [] as Task[];
        task.parentColumn = null;

        if (!task.parent.parent) {
            task.parent = null;
        } else {
            task.parent = task.parent.parent;
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

            foundUser.tasks.push(task);

            await this.userRepository.save(foundUser);

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

            foundUser.tasks = foundUser.tasks.filter((task) => {
                task.id !== taskId;
            });

            await this.userRepository.save(foundUser);

            deletedMemberIds.push(memberId);
        }

        return { memberIds, deletedMemberIds, notFoundUserIds, alreadyNotTaskMemberIds };
    }

    async deleteTask(user: User, deleteTaskDto: DeleteTaskDto): Promise<void> {
        const { taskId, cascading } = deleteTaskDto;

        const taskQuery = this.taskRepository.createQueryBuilder("task");

        taskQuery
            .select(["task.id"])
            .leftJoin("task.project", "project")
            .addSelect(["project.id"])
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

    async createContent(
        user: User,
        taskId: string,
        createContentDto: CreateContentDto,
    ): Promise<{
        id: string;
        title: string;
        content: string;
        taskId: string;
    }> {
        const { title, content } = createContentDto;

        if(!taskId || !title){
            throw new BadRequestException("Task id and title are required.");
        }

        const taskQuery = this.taskRepository.createQueryBuilder("task");

        taskQuery.where("task.id = :taskId", { taskId });

        const task: Task = await taskQuery.getOne();

        if (!task) {
            throw new NotFoundException(`The task with id ${taskId} is not found.`);
        }

        const now = new Date();
        const newContent = new TaskContent();

        newContent.title = title;
        newContent.content = content;
        newContent.task = task;
        newContent.createdAt = now;
        newContent.modifiedAt = now;

        await this.contentRepository.save(newContent);

        return {
            id: newContent.id,
            title: newContent.title,
            content: newContent.content,
            taskId: newContent.task.id,
        };
    }



    async getAllContents(
        user: User,
        taskId: string,
    ): Promise<TaskContent[]>{
        const contentQuery = this.contentRepository.createQueryBuilder("content");

        contentQuery
            .select(["content.id", "content.title", "content.content"])
            .leftJoin("content.task", "task")
            .addSelect(["task.id"])
            .where("task.id = :taskId", { taskId });

        const contents: TaskContent[] = await contentQuery.getMany();

        return contents;
    }

    async updateContent(
        user: User,
        contentId: string,
        updateContentDto: UpdateContentDto,
    ): Promise<{
        id: string;
        title: string;
        content: string;
        contentId: string;
    }> {
        const { title, content } = updateContentDto;

        const contentQuery = this.contentRepository.createQueryBuilder("content");

        contentQuery.where("content.id = :contentId", { contentId });

        const taskContent: TaskContent = await contentQuery.getOne();

        if (!taskContent) {
            throw new NotFoundException(`The task with id ${contentId} is not found.`);
        }

        if (title) {
            taskContent.title = title;
        }

        if (content) {
            taskContent.content = content;
        }

        taskContent.modifiedAt = new Date();
        await this.contentRepository.save(taskContent);

        return {
            id: taskContent.id,
            title: taskContent.title,
            content: taskContent.content,
            contentId: taskContent.id,
        };
    }

    async deleteContent(user: User, contentId: string): Promise<void> {
        const contentQuery = this.contentRepository.createQueryBuilder("content");

        contentQuery
            .select(["content.id"])
            .leftJoin("content.task", "task")
            .addSelect(["task.id"])
            .where("content.id = :contentId", { contentId });

        const foundContent: TaskContent = await contentQuery.getOne();

        if (!foundContent) {
            throw new NotFoundException(`The content with id ${contentId} is not found.`);
        }

        await this.contentRepository.delete({ id: contentId });
    }

    async createBookmark(
        user: User,
        taskId: string,
    ): Promise<{
        id: string;
        taskId: string;
    }> {
        const taskQuery = this.taskRepository.createQueryBuilder("task");

        taskQuery.where("task.id = :taskId", { taskId });

        const task: Task = await taskQuery.getOne();

        if (!task) {
            throw new NotFoundException(`The task with id ${taskId} is not found.`);
        }

        const userToTask = new UserToTask();

        userToTask.user = user;
        userToTask.task = task;
        userToTask.bookmark = true;

        await this.userToTaskRepository.save(userToTask);

        return {
            id: userToTask.id,
            taskId: userToTask.task.id,
        };
    }

    async deleteBookmark( user: User, taskId: string ): Promise<void> {
        const userToTaskQuery = this.userToTaskRepository.createQueryBuilder("userToTask");
        
        userToTaskQuery
            .select(["userToTask.id"])
            .leftJoin("userToTask.user", "user")
            .addSelect(["user.id"])
            .leftJoin("userToTask.task", "task")
            .addSelect(["task.id"])
            .where("userToTask.task.id = :taskId", { taskId });

        const userToTask: UserToTask = await userToTaskQuery.getOne();

        if (!userToTask) {
            throw new NotFoundException(`The bookmark with id ${taskId} is not found.`);
        }

        await this.userToTaskRepository.delete({ id: userToTask.id });


    }

    async getAllBookmarks(user: User): Promise<Task[]> {
        const userToTaskQuery = this.userToTaskRepository.createQueryBuilder("userToTask");

        userToTaskQuery.leftJoinAndSelect("userToTask.task", "task").where("userToTask.user.id = :userId", { userId: user.id });

        const userToTasks: UserToTask[] = await userToTaskQuery.getMany();

        const tasks: Task[] = [];
        for (const userToTask of userToTasks) {
            tasks.push(userToTask.task);
        }

        return tasks;
    }
}