import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "src/entity/project.entity";
import { Task } from "src/entity/task.entity";
import { User } from "src/entity/user.entity";
import { Relation } from "src/enum/relation.enum";
import { SubTask } from "src/enum/sub-task.enum";
import { ProjectRepository } from "src/project/project.repository";
import { TaskRepository } from "src/task/task.repository";

@Injectable()
export class AnalysisService {
    constructor(
        @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
        @InjectRepository(ProjectRepository) private projectRepository: ProjectRepository,
    ) {}

    async getRootTodo(user: User, projectId: string): Promise<{ todo: Task[]; cycles: Set<Task>[] }> {
        const projectQuery = this.projectRepository.createQueryBuilder("project");

        projectQuery
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
                userId: user.id,
            })
            .where("project.id = :projectId", { projectId });

        const project: Project = await projectQuery.getOne();

        if (!project) {
            throw new NotFoundException(`Project with id ${projectId} is not found.`);
        }

        if (project.userToProjects.length === 0) {
            throw new UnauthorizedException(`User ${user.email} is not member of the project with id ${projectId}.`);
        }

        if (project.type !== SubTask.GRAPH) {
            throw new NotAcceptableException(
                `User ${user.email} can get todo list of the only graph project. This project is ${project.type}`,
            );
        }

        const rootsQuery = this.taskRepository.createQueryBuilder("task");

        rootsQuery
            .leftJoinAndSelect("task.predecessors", "predecessors")
            .leftJoinAndSelect("task.successors", "successors")
            .leftJoinAndSelect("task.members", "members", "members.id = :userId", { userId: user.id })
            .where("task.parentId IS NULL")
            .andWhere("task.projectId = :projectId", { projectId });

        const roots: Task[] = await rootsQuery.getMany();

        const count = roots.length;

        if (count === 0) {
            return { todo: new Array<Task>(), cycles: new Array<Set<Task>>() };
        }

        const cycles = await this.getCycles(roots);

        if (cycles.length >= 1) {
            return { todo: new Array<Task>(), cycles };
        }

        const indexes = new Map<string, number>();
        for (let i = 0; i < count; ++i) {
            indexes.set(roots[i].id, i);
        }

        const discovered = new Set<number>();
        const todoNum = new Array<number>();

        for (let i = 0; i < count; ++i) {
            if (discovered.has(i)) {
                continue;
            }

            this.postOrderingRecursive(roots, indexes, i, discovered, todoNum);
        }

        const todo = new Array<Task>();

        for (const taskNum of todoNum) {
            todo.push(roots[taskNum]);
        }

        return { todo, cycles: new Array<Set<Task>>() };
    }

    async getTodo(user: User, parentId: string): Promise<{ todo: Task[]; cycles: Set<Task>[] }> {
        const parentQuery = this.taskRepository.createQueryBuilder("task");

        parentQuery
            .leftJoinAndSelect("task.project", "project")
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
                userId: user.id,
            })
            .leftJoinAndSelect("task.children", "children")
            .leftJoinAndSelect("children.predecessors", "predecessors")
            .leftJoinAndSelect("children.successors", "successors")
            .leftJoinAndSelect("children.members", "members", "members.id = :userId", { userId: user.id })
            .where("task.id = :parentId", { parentId });

        const parent: Task = await parentQuery.getOne();

        if (!parent) {
            throw new NotFoundException(`The parent task with id ${parent} is not found.`);
        }

        if (parent.project.userToProjects.length === 0) {
            throw new UnauthorizedException(
                `User ${user.email} is not member of the project with id ${parent.project.id}.`,
            );
        }

        if (parent.type !== SubTask.GRAPH) {
            throw new NotAcceptableException(
                `User ${user.email} can get todo list of the only graph project. This task is ${parent.type}`,
            );
        }

        const children: Task[] = parent.children;

        const count = children.length;

        if (count === 0) {
            return { todo: new Array<Task>(), cycles: new Array<Set<Task>>() };
        }

        const cycles = await this.getCycles(children);

        if (cycles.length >= 1) {
            return { todo: new Array<Task>(), cycles };
        }

        const indexes = new Map<string, number>();
        for (let i = 0; i < count; ++i) {
            indexes.set(children[i].id, i);
        }

        const discovered = new Set<number>();
        const todoNum = new Array<number>();

        for (let i = 0; i < count; ++i) {
            if (discovered.has(i)) {
                continue;
            }

            this.postOrderingRecursive(children, indexes, i, discovered, todoNum);
        }

        const todo = new Array<Task>();

        for (const taskNum of todoNum) {
            todo.push(children[taskNum]);
        }

        return { todo, cycles: new Array<Set<Task>>() };
    }

    async getRelation(user: User, firstTaskId: string, secondTaskId: string): Promise<{ relation: Relation }> {
        const firstQuery = this.taskRepository.createQueryBuilder("task");

        firstQuery
            .leftJoinAndSelect("task.parent", "parent")
            .leftJoinAndSelect("task.project", "project")
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
                userId: user.id,
            })
            .where("task.id = :taskId", { taskId: firstTaskId });

        const firstTask = await firstQuery.getOne();

        if (!firstTask) {
            throw new NotFoundException(`The first task ${firstTaskId} is not found.`);
        }

        if (firstTask.project.userToProjects.length === 0) {
            throw new UnauthorizedException(`User ${user.email} is not member of the project ${firstTask.project.id}`);
        }

        const secondQuery = this.taskRepository.createQueryBuilder("task");

        secondQuery
            .leftJoinAndSelect("task.parent", "parent")
            .leftJoinAndSelect("task.project", "project")
            .where("task.id = :taskId", { taskId: secondTaskId });

        const secondTask = await secondQuery.getOne();

        if (!secondTask) {
            throw new NotFoundException(`The second task ${secondTaskId} is not found.`);
        }

        if (
            !(
                (firstTask.parent && secondTask.parent && firstTask.parent.id === secondTask.parent.id) ||
                (!firstTask.parent && !secondTask.parent && firstTask.project.id === secondTask.project.id)
            )
        ) {
            throw new NotAcceptableException(
                `The first task ${firstTaskId} and second task ${secondTaskId} has different parent.`,
            );
        }

        const childrenQuery = this.taskRepository.createQueryBuilder("task");

        childrenQuery.leftJoinAndSelect("task.successors", "successors");

        if (firstTask.parent) {
            childrenQuery.where("task.parentId = :parentId", { parentId: firstTask.parent.id });
        } else {
            childrenQuery
                .where("task.projectId = :projectId", { projectId: firstTask.project.id })
                .andWhere("task.parent IS NULL");
        }

        const children = await childrenQuery.getMany();

        const indexes = new Map<string, number>();
        for (let i = 0; i < children.length; ++i) {
            indexes.set(children[i].id, i);
        }

        const discovered = new Set<number>();
        const successors = new Set<number>();
        const stack = new Array<number>();

        const firstTaskNum: number = indexes.get(firstTask.id);

        stack.push(firstTaskNum);
        discovered.add(firstTaskNum);

        while (stack.length !== 0) {
            const next: number = stack.pop();

            successors.add(next);

            for (const successor of children[next].successors) {
                const successorNum = indexes.get(successor.id);

                if (!discovered.has(successorNum)) {
                    stack.push(successorNum);
                    discovered.add(successorNum);
                }
            }
        }

        const secondTaskNum: number = indexes.get(secondTask.id);

        if (successors.has(secondTaskNum)) {
            return { relation: Relation.FIRST };
        }

        discovered.clear();
        successors.clear();
        stack.length = 0;

        stack.push(secondTaskNum);
        discovered.add(secondTaskNum);

        while (stack.length !== 0) {
            const next: number = stack.pop();

            successors.add(next);

            for (const successor of children[next].successors) {
                const successorNum = indexes.get(successor.id);

                if (!discovered.has(successorNum)) {
                    stack.push(successorNum);
                    discovered.add(successorNum);
                }
            }
        }

        if (successors.has(firstTaskNum)) {
            return { relation: Relation.LATER };
        }

        return { relation: Relation.NO };
    }

    async getMemberTasksInRoot(
        user: User,
        projectId: string,
        memberId: string,
    ): Promise<{ myTasks: Task[]; yourTasks: Task[]; intersection: Task[] }> {
        const projectQuery = this.projectRepository.createQueryBuilder("project");

        projectQuery
            .leftJoinAndSelect(
                "project.userToProjects",
                "userToProjects",
                "userToProjects.userId = :userId OR userToProjects.userId = :memberId",
                { userId: user.id, memberId },
            )
            .where("project.id = :projectId", { projectId });

        const project = await projectQuery.getOne();

        if (!project) {
            throw new NotFoundException(`The project ${projectId} is not found.`);
        }

        if (project.userToProjects.length < 2) {
            throw new NotFoundException(`The user ${user.id} or ${memberId} is not found in this project.`);
        }

        const yourTaskQuery = this.taskRepository.createQueryBuilder("task");

        yourTaskQuery
            .innerJoin("task.members", "members", "members.id = :memberId", { memberId })
            .where("task.parent IS NULL")
            .andWhere("task.projectId = :projectId", { projectId });

        const yourTasks: Task[] = await yourTaskQuery.getMany();

        const myTaskQuery = this.taskRepository.createQueryBuilder("task");

        myTaskQuery
            .innerJoin("task.members", "members", "members.id = :userId", { userId: user.id })
            .where("task.parent IS NULL")
            .andWhere("task.projectId = :projectId", { projectId });

        const myTasks: Task[] = await myTaskQuery.getMany();

        const intersection: Task[] = myTasks.filter((myTask) => {
            for (const yourTask of yourTasks) {
                if (myTask === yourTask) {
                    return true;
                }
            }
        });

        return { myTasks, yourTasks, intersection };
    }

    async getMemberTasks(
        user: User,
        parentId: string,
        memberId: string,
    ): Promise<{ myTasks: Task[]; yourTasks: Task[]; intersection: Task[] }> {
        const parentQuery = this.taskRepository.createQueryBuilder("task");

        parentQuery
            .leftJoinAndSelect("task.project", "project")
            .leftJoinAndSelect(
                "project.userToProjects",
                "userToProjects",
                "userToProjects.userId = :userId OR userToProjects.userId = :memberId",
                { userId: user.id, memberId },
            )
            .where(`task.id = :parentId`, { parentId });

        const parent: Task = await parentQuery.getOne();

        if (!parent) {
            throw new NotFoundException(`The parent task ${parentId} is not found`);
        }

        if (parent.project.userToProjects.length < 2) {
            throw new NotFoundException(`The user ${user.id} or ${memberId} is not found in this project.`);
        }

        const yourTaskQuery = this.taskRepository.createQueryBuilder("task");

        yourTaskQuery
            .innerJoin("task.members", "members", "members.id = :memberId", { memberId })
            .where("task.parentId = :parentId", { parentId });

        const yourTasks: Task[] = await yourTaskQuery.getMany();

        const myTaskQuery = this.taskRepository.createQueryBuilder("task");

        myTaskQuery
            .innerJoin("task.members", "members", "members.id = :userId", { userId: user.id })
            .where("task.parentId = :parentId", { parentId });

        const myTasks: Task[] = await myTaskQuery.getMany();

        const intersection: Task[] = myTasks.filter((myTask) => {
            for (const yourTask of yourTasks) {
                if (myTask === yourTask) {
                    return true;
                }
            }
        });

        return { myTasks, yourTasks, intersection };
    }

    private async getCycles(tasks: Task[]): Promise<Set<Task>[]> {
        const count = tasks.length;

        if (count === 0) {
            return new Array<Set<Task>>();
        }

        const indexes = new Map<string, number>();
        for (let i = 0; i < count; ++i) {
            indexes.set(tasks[i].id, i);
        }

        const isVisited = new Array<boolean>(count).fill(false);
        const isFinished = new Array<boolean>(count).fill(false);
        const stack = new Array<number>();
        const sccNum = new Array<number[]>();
        const scc = new Array<Set<Task>>();

        const dfs = function (vertex: number): number {
            let parent: number = vertex;
            isVisited[vertex] = true;
            stack.push(vertex);

            for (let i = 0; i < tasks[vertex].successors.length; ++i) {
                const nextVer: Task = tasks[vertex].successors[i];
                const nextVerIdx = indexes.get(nextVer.id);

                if (!isVisited[nextVerIdx]) {
                    parent = Math.min(parent, dfs(nextVerIdx));
                } else if (!isFinished[nextVerIdx]) {
                    parent = nextVerIdx;
                }
            }

            if (parent === vertex) {
                const sccEl = new Array<number>();
                let topEl = 0;

                do {
                    topEl = stack.pop();
                    isFinished[topEl] = true;
                    sccEl.unshift(topEl);
                } while (topEl !== parent);

                sccNum.push(sccEl);
            }

            return parent;
        };

        for (let vertex = 0; vertex < count; ++vertex) {
            if (!isFinished[vertex]) {
                dfs(vertex);
            }
        }

        for (const el of sccNum) {
            if (el.length <= 1) {
                continue;
            }

            const sccEl = new Set<Task>();
            for (const taskIdx of el) {
                sccEl.add(tasks[taskIdx]);
            }
            scc.push(sccEl);
        }

        return scc;
    }

    private postOrderingRecursive(
        tasks: Task[],
        indexes: Map<string, number>,
        task: number,
        discovered: Set<number>,
        todo: number[],
    ): void {
        discovered.add(task);

        for (const predecessor of tasks[task].predecessors) {
            const preNum: number = indexes.get(predecessor.id);

            if (discovered.has(preNum)) {
                continue;
            }

            this.postOrderingRecursive(tasks, indexes, preNum, discovered, todo);
        }

        todo.push(task);
    }
}
