import { CustomRepository } from "src/typeorm/typeorm-ex.decorator";
import { TreeRepository } from "typeorm";
import { ProjectContent } from "src/entity/project-content.entity";

@CustomRepository(ProjectContent)
export class ProjectContentRepository extends TreeRepository<ProjectContent> {}
