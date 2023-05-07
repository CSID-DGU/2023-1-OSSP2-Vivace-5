import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
} from "typeorm";
import { Project } from "./project.entity";
import { User } from "./user.entity";

@Entity()
@Tree("closure-table", {
    closureTableName: "project_comment_closure",
})
export class ProjectComment extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    createdAt: Date;

    @Column()
    modifiedAt: Date;

    @Column()
    content: string;

    @Column()
    pinned: boolean;

    @TreeParent()
    parent: ProjectComment;

    @TreeChildren()
    children: ProjectComment[];

    @ManyToOne((type) => User, (user) => user.projectComments, { eager: false })
    user: User;

    @Column({ name: "projectId" })
    projectId: string;

    @ManyToOne((type) => Project, (project) => project.comments, { eager: false })
    @JoinColumn({ name: "projectId" })
    project: Project;
}
