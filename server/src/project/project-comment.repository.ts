import { CustomRepository } from "src/typeorm/typeorm-ex.decorator";
import { TreeRepository } from "typeorm";
import { ProjectComment } from "src/entity/project-comment.entity";

@CustomRepository(ProjectComment)
export class ProjectCommentRepository extends TreeRepository<ProjectComment> {}
