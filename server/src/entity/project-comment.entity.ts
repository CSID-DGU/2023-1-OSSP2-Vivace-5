import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeLevelColumn,
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

    @TreeLevelColumn()
    level: number;

    @ManyToOne((type) => User, (user) => user.projectComments, { eager: false })
    user: User;

    @ManyToOne((type) => Project, (project) => project.comments, { eager: false })
    project: Project;
}
