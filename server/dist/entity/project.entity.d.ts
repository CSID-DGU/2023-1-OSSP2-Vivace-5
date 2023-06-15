import { BaseEntity } from "typeorm";
import { SubTask } from "../enum/sub-task.enum";
import { UserToProject } from "./user-to-project.entity";
import { Task } from "src/entity/task.entity";
import { ProjectComment } from "./project-comment.entity";
import { KanbanColumn } from "./kanban-column.entity";
import { Bookmark } from "./bookmark.entity";
import { ProjectContent } from "./project-content.entity";
export declare class Project extends BaseEntity {
    id: string;
    title: string;
    description: string;
    type: SubTask;
    encodedImg: string;
    createdAt: Date;
    tasks: Task[];
    comments: ProjectComment[];
    userToProjects: UserToProject[];
    columns: KanbanColumn[];
    bookmarks: Bookmark[];
    contents: ProjectContent[];
}
