import { CustomRepository } from "src/typeorm/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { Project } from "../entity/project.entity";

@CustomRepository(Project)
export class ProjectRepository extends Repository<Project> {}
