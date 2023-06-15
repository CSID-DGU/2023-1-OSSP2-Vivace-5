import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.entity";

@Entity()
export class ProjectContent extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    createdAt: Date;

    @Column()
    modifiedAt: Date;

    @Column()
    content: string;

    @ManyToOne((type) => Project, (project) => project.contents, { eager: false, onDelete: "CASCADE" })
    project: Project;
}
