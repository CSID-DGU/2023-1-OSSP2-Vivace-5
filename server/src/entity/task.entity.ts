import { Project } from "src/entity/project.entity";
import { SubTask } from "src/enum/sub-task.enum";
import { UserToTask } from "src/entity/user-to-task.entity";
import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeLevelColumn,
    TreeParent,
} from "typeorm";

@Entity()
@Tree("closure-table", {
    closureTableName: "task_closure",
})
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    type: SubTask;

    @Column()
    filePath: string;

    @Column()
    mailstone: boolean;

    @Column()
    createdAt: Date;

    @Column()
    modifiedAt: Date;

    @Column()
    start: Date;

    @Column()
    end: Date;

    @Column()
    deadline: Date;

    @Column()
    isFinished: boolean;

    @TreeParent()
    parent: Task;

    @TreeChildren()
    children: Task[];

    @OneToMany((type) => Task, (task) => task.successors, { eager: false })
    predecessors: Task[];

    @OneToMany((type) => Task, (task) => task.predecessors, { eager: false })
    successors: Task[];

    @TreeLevelColumn()
    level: number;

    @Column({ name: "projectId" })
    projectId: string;

    @ManyToOne((type) => Project, (project) => project.tasks, { eager: false })
    @JoinColumn({ name: "projectId" })
    project: Project;

    @OneToMany((type) => UserToTask, (userToTask) => userToTask.task, { eager: false })
    userToTasks: UserToTask[];
}
