import { CustomRepository } from "src/typeorm/typeorm-ex.decorator";
import { UserToProject } from "../entity/user-to-project.entity";
import { Repository } from "typeorm";

@CustomRepository(UserToProject)
export class UserToProjectRepository extends Repository<UserToProject> {}
