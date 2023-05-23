import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProjectRepository } from "./project.repository";
import { User } from "src/entity/user.entity";
import { Project } from "../entity/project.entity";
import { ProjectInfoDto, MemberDto } from "./dto/project-info.dto";
import { Task } from "src/entity/task.entity";
import { UserToProject } from "../entity/user-to-project.entity";
import { UserRight } from "../enum/user-right.enum";
import { UserToProjectRepository } from "./user-to-project.repository";
import { ProjectComment } from "src/entity/project-comment.entity";
import { ProjectCommentRepository } from "./project-comment.repository";
import { Brackets } from "typeorm";
import { TaskRepository } from "src/task/task.repository";
import { UserRepository } from "src/user/user.repository";

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(ProjectRepository) private projectRepository: ProjectRepository,
        @InjectRepository(UserToProjectRepository) private userToProjectRepository: UserToProjectRepository,
        @InjectRepository(ProjectCommentRepository) private projectCommentRepository: ProjectCommentRepository,
        @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
        @InjectRepository(UserRepository) private userRepository: UserRepository,
    ) {}

    async getAllProjects(user: User, queryString: string): Promise<Project[]> {
        const query = this.projectRepository.createQueryBuilder("project");

        query
            .select([
                "project.id",
                "project.title",
                "project.description",
                "project.type",
                "userToProjects.userRight",
                "project.encodedImg",
            ])
            .leftJoin("project.userToProjects", "userToProjects")
            .where("userToProjects.userId = :userId", { userId: user.id });

        if (queryString) {
            query.andWhere(
                new Brackets((qb) => {
                    qb.where("project.title LIKE :queryString", { queryString: `%${queryString}%` }).orWhere(
                        "project.description LIKE :queryString",
                        { queryString: `%${queryString}%` },
                    );
                }),
            );
        }

        return query.getMany();
    }

    async getProjectInfo(user: User, projectId: string): Promise<Project> {
        const query = this.projectRepository.createQueryBuilder("project");

        query
            .select([
                "project.title",
                "project.description",
                "project.type",
                "project.encodedImg",
                "project.createdAt",
                "userToProjects.userRight",
                "user.id",
                "user.encodedImg",
                "user.firstName",
                "user.lastName",
            ])
            .leftJoin("project.userToProjects", "userToProjects")
            .leftJoin("userToProjects.user", "user")
            .leftJoinAndSelect("project.tasks", "task")
            .leftJoinAndSelect("project.comments", "comments")
            .where("project.id = :projectId", { projectId });

        const found = await query.getOne();

        if (!found) {
            throw new NotFoundException(`Project with id "${projectId}" is not found.`);
        }

        let includeUser: boolean = false;

        found.userToProjects.forEach((member: UserToProject) => {
            if (member.user.id === user.id) {
                includeUser = true;
            }
        });

        if (!includeUser) {
            throw new UnauthorizedException(
                `You "${user.email}" are not authorized to view the information on this project. Join this project for this information.`,
            );
        }

        return found;
    }

    async createProject(user: User, projectInfoDto: ProjectInfoDto): Promise<{ notFoundUserId: string[] }> {
        const { title, description, type, encodedImg, members } = projectInfoDto;

        const project = new Project();
        project.title = title;
        project.description = description;
        project.type = type;
        project.encodedImg = encodedImg;
        project.comments = [] as ProjectComment[];
        project.tasks = [] as Task[];
        project.userToProjects = [] as UserToProject[];

        const now = new Date();
        project.createdAt = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds(),
            ),
        );

        await this.projectRepository.save(project);

        const userToProject = new UserToProject();
        userToProject.userRight = UserRight.ADMIN;
        userToProject.project = project;
        userToProject.user = user;

        await this.userToProjectRepository.save(userToProject);

        const notFoundUserId: string[] = [];

        for (const member of members) {
            const memberEntity: User = await this.userRepository.findOneBy({ id: member.id });

            if (memberEntity) {
                const memberToProject = new UserToProject();
                memberToProject.userRight = member.right;
                memberToProject.project = project;
                memberToProject.user = memberEntity;

                await this.userToProjectRepository.save(memberToProject);
            } else {
                notFoundUserId.push(member.id);
            }
        }

        return { notFoundUserId: notFoundUserId };
    }

    async updateProject(
        user: User,
        projectId: string,
        projectInfoDto: ProjectInfoDto,
    ): Promise<{ notFoundUserId: string[] }> {
        const { title, description, encodedImg, members } = projectInfoDto;

        const query = this.projectRepository.createQueryBuilder("project");

        query
            .leftJoinAndSelect("project.userToProjects", "userToProjects")
            .leftJoinAndSelect("userToProjects.user", "user")
            .where("project.id =:projectId", { projectId });

        const found: Project = await query.getOne();

        if (!found) {
            throw new NotFoundException(`Project with id "${projectId}" is not found.`);
        }

        let right: UserRight = null;

        found.userToProjects.forEach((member: UserToProject) => {
            if (member.user.id === user.id) {
                right = member.userRight;
            }
        });

        if (right !== UserRight.ADMIN) {
            throw new UnauthorizedException(
                `You "${user.email}" are not authorized to update the information on this project. Your right in this project is "${right}".`,
            );
        }

        found.title = title;
        found.description = description;
        found.encodedImg = encodedImg;

        await this.projectRepository.save(found);

        for (const member of found.userToProjects) {
            await this.userToProjectRepository.delete({ id: member.id });
        }

        const userToProject = new UserToProject();
        userToProject.userRight = right;
        userToProject.project = found;
        userToProject.user = user;

        await this.userToProjectRepository.save(userToProject);

        const notFoundUserId: string[] = [];

        for (const member of members) {
            const memberEntity: User = await this.userRepository.findOneBy({ id: member.id });

            if (memberEntity) {
                const memberToProject = new UserToProject();
                memberToProject.userRight = member.right;
                memberToProject.project = found;
                memberToProject.user = memberEntity;

                await this.userToProjectRepository.save(memberToProject);
            } else {
                notFoundUserId.push(member.id);
            }
        }

        return { notFoundUserId: notFoundUserId };
    }

    async deleteProject(user: User, projectId: string): Promise<void> {
        const query = this.projectRepository.createQueryBuilder("project");

        query
            .leftJoinAndSelect("project.userToProjects", "userToProjects")
            .leftJoinAndSelect("userToProjects.user", "user")
            .where("project.id =:projectId", { projectId });

        const found: Project = await query.getOne();

        if (!found) {
            throw new NotFoundException(`Project with id "${projectId}" is not found.`);
        }

        let right: UserRight = null;

        found.userToProjects.forEach((member: UserToProject) => {
            if (member.user.id === user.id) {
                right = member.userRight;
            }
        });

        if (!right) {
            throw new UnauthorizedException(
                `You "${user.email}" are not authorized to delete this project. Join this project for elimination.`,
            );
        }

        if (right === UserRight.ADMIN) {
            await this.userToProjectRepository.delete({ projectId });
            await this.projectCommentRepository.delete({ projectId });
            await this.taskRepository.delete({ projectId });

            await this.projectRepository.delete({ id: projectId });
        } else {
            throw new UnauthorizedException(
                `You "${user.email}" are not authorized to delete this project. Your right in this project is "${right}". Only an administrator can delete a project.`,
            );
        }
    }

    async invite(
        user: User,
        projectId: string,
        members: MemberDto[],
    ): Promise<{ notFoundUserId: string[]; alreadyMemberUserId: string[] }> {
        const query = this.projectRepository.createQueryBuilder("project");

        query
            .leftJoinAndSelect("project.userToProjects", "userToProjects")
            .leftJoinAndSelect("userToProjects.user", "user")
            .where("project.id =:projectId", { projectId });

        const foundProject: Project = await query.getOne();

        if (!foundProject) {
            throw new NotFoundException(`Project with id "${projectId}" is not found.`);
        }

        let right: UserRight = null;

        foundProject.userToProjects.forEach((member: UserToProject) => {
            if (member.user.id === user.id) {
                right = member.userRight;
            }
        });

        if (!right) {
            throw new UnauthorizedException(
                `You "${user.email}" are not authorized to invite people into this project. Join this project for invitation.`,
            );
        }

        if (right === UserRight.COMPLETION_MOD || right === UserRight.TASK_MGT) {
            throw new UnauthorizedException(
                `You "${user.email}" are not authorized to invite people into this project. Your right in this project is "${right}".`,
            );
        }

        const notFoundUserId: string[] = [];
        const alreadyMemberUserId: string[] = [];

        for (const member of members) {
            const memberEntity: User = await this.userRepository.findOneBy({ id: member.id });

            if (memberEntity) {
                const query = this.userToProjectRepository.createQueryBuilder("userToProject");

                query
                    .leftJoin("userToProject.user", "user")
                    .leftJoin("userToProject.project", "project")
                    .where("user.id = :userId", { userId: memberEntity.id })
                    .andWhere("project.id = :projectId", { projectId });

                const foundUser = await query.getOne();

                if (!foundUser) {
                    const memberToProject = new UserToProject();

                    if (right === UserRight.ADMIN) {
                        memberToProject.userRight = member.right;
                    } else {
                        memberToProject.userRight = UserRight.COMPLETION_MOD;
                    }

                    memberToProject.project = foundProject;
                    memberToProject.user = memberEntity;

                    await this.userToProjectRepository.save(memberToProject);
                } else {
                    alreadyMemberUserId.push(member.id);
                }
            } else {
                notFoundUserId.push(member.id);
            }
        }

        return { notFoundUserId, alreadyMemberUserId };
    }

    async dismiss(
        user: User,
        projectId: string,
        members: string[],
    ): Promise<{ notFoundUserId: string[]; alreadyNotMemberUserId: string[]; adminUserId: string[] }> {
        const query = this.projectRepository.createQueryBuilder("project");

        query
            .leftJoinAndSelect("project.userToProjects", "userToProjects")
            .leftJoinAndSelect("userToProjects.user", "user")
            .where("project.id =:projectId", { projectId });

        const foundProject: Project = await query.getOne();

        if (!foundProject) {
            throw new NotFoundException(`Project with id "${projectId}" is not found.`);
        }

        let right: UserRight = null;

        foundProject.userToProjects.forEach((member: UserToProject) => {
            if (member.user.id === user.id) {
                right = member.userRight;
            }
        });

        if (!right) {
            throw new UnauthorizedException(
                `You "${user.email}" are not authorized to dismiss people from this project. Join this project for dismissal.`,
            );
        }

        if (right === UserRight.COMPLETION_MOD || right === UserRight.TASK_MGT) {
            throw new UnauthorizedException(
                `You "${user.email}" are not authorized to dismiss people from this project. Your right in this project is "${right}".`,
            );
        }

        const notFoundUserId: string[] = [];
        const alreadyNotMemberUserId: string[] = [];
        const adminUserId: string[] = [];

        for (const memberId of members) {
            const memberEntity: User = await this.userRepository.findOneBy({ id: memberId });

            if (memberEntity) {
                const query = this.userToProjectRepository.createQueryBuilder("userToProject");

                query
                    .leftJoin("userToProject.user", "user")
                    .leftJoin("userToProject.project", "project")
                    .where("user.id = :userId", { userId: memberEntity.id })
                    .andWhere("project.id = :projectId", { projectId });

                const foundUser = await query.getOne();

                if (foundUser) {
                    if (foundUser.userRight !== UserRight.ADMIN || right === UserRight.ADMIN) {
                        await this.userToProjectRepository.delete({ id: foundUser.id });
                    } else {
                        adminUserId.push(memberId);
                    }
                } else {
                    alreadyNotMemberUserId.push(memberId);
                }
            } else {
                notFoundUserId.push(memberId);
            }
        }

        return { notFoundUserId, alreadyNotMemberUserId, adminUserId };
    }

    async withdraw(user: User, projectId: string): Promise<void> {
        const query = this.projectRepository.createQueryBuilder("project");

        query
            .leftJoinAndSelect("project.userToProjects", "userToProjects")
            .leftJoinAndSelect("userToProjects.user", "user")
            .where("project.id =:projectId", { projectId });

        const foundProject: Project = await query.getOne();

        if (!foundProject) {
            throw new NotFoundException(`Project with id "${projectId}" is not found.`);
        }

        let right: UserRight = null;
        let userToProject: UserToProject = null;

        foundProject.userToProjects.forEach((member: UserToProject) => {
            if (member.user.id === user.id) {
                right = member.userRight;
                userToProject = member;
            }
        });

        if (!userToProject) {
            throw new UnauthorizedException(
                `You "${user.email}" are not member of this project with id "${projectId}".`,
            );
        }

        if (right === UserRight.ADMIN) {
            throw new UnauthorizedException(
                `You "${user.email}" are administer of this project with id "${projectId}". You cannot withdraw this project.`,
            );
        }

        await this.userToProjectRepository.delete({ id: userToProject.id });
    }

    async addComment(user: User, projectId: string, content: string): Promise<void> {
        const query = this.projectRepository.createQueryBuilder("project");

        query
            .leftJoinAndSelect("project.userToProjects", "userToProjects")
            .leftJoinAndSelect("userToProjects.user", "user")
            .where("project.id =:projectId", { projectId });

        const foundProject: Project = await query.getOne();

        if (!foundProject) {
            throw new NotFoundException(`Project with id "${projectId}" is not found.`);
        }

        let userToProject: UserToProject = null;

        foundProject.userToProjects.forEach((member: UserToProject) => {
            if (member.user.id === user.id) {
                userToProject = member;
            }
        });

        if (!userToProject) {
            throw new UnauthorizedException(
                `You "${user.email}" are not member of this project with id "${projectId}".`,
            );
        }

        const projectComment = new ProjectComment();

        const now = new Date();
        projectComment.createdAt = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds(),
            ),
        );

        projectComment.modifiedAt = new Date(projectComment.createdAt.getTime());
        projectComment.content = content;
        projectComment.pinned = false;
        projectComment.user = user;
        projectComment.project = foundProject;

        await this.projectCommentRepository.save(projectComment);
    }

    async addReply(user: User, commentId: string, content: string): Promise<void> {
        const query = this.projectCommentRepository.createQueryBuilder("projectComment");

        query
            .leftJoinAndSelect("projectComment.project", "project")
            .leftJoinAndSelect("project.userToProjects", "userToProjects")
            .leftJoinAndSelect("userToProjects.user", "user")
            .where("projectComment.id = :commentId", { commentId });

        const found: ProjectComment = await query.getOne();

        if (!found) {
            throw new NotFoundException(`Project comment with id "${commentId}" is not found.`);
        }

        let isMember: boolean = false;

        found.project.userToProjects.forEach((member: UserToProject) => {
            if (member.user.id === user.id) {
                isMember = true;
            }
        });

        if (!isMember) {
            throw new UnauthorizedException(
                `You "${user.email}" are not member of this project with id "${found.project.id}".`,
            );
        }

        const projectComment = new ProjectComment();

        const now = new Date();
        projectComment.createdAt = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds(),
            ),
        );

        projectComment.modifiedAt = new Date(projectComment.createdAt.getTime());
        projectComment.content = content;
        projectComment.pinned = false;
        projectComment.parent = found;
        projectComment.user = user;
        projectComment.project = found.project;

        await this.projectCommentRepository.save(projectComment);
    }

    async getAllComments(
        user: User,
        projectId: string,
        queryString: string,
    ): Promise<{ isQueried: boolean; queryResult: ProjectComment[] }> {
        const projectQuery = this.projectRepository.createQueryBuilder("project");

        projectQuery
            .leftJoinAndSelect("project.userToProjects", "userToProjects")
            .leftJoinAndSelect("userToProjects.user", "user")
            .where("project.id =:projectId", { projectId });

        const foundProject: Project = await projectQuery.getOne();

        if (!foundProject) {
            throw new NotFoundException(`Project with id "${projectId}" is not found.`);
        }

        let isMember: boolean = false;

        foundProject.userToProjects.forEach((member: UserToProject) => {
            if (member.user.id === user.id) {
                isMember = true;
            }
        });

        if (!isMember) {
            throw new UnauthorizedException(
                `You "${user.email}" are not member of this project with id "${projectId}".`,
            );
        }

        const commentQuery = this.projectCommentRepository.createQueryBuilder("projectComment");

        commentQuery
            .select(["projectComment", "user.id", "user.firstName", "user.lastName"])
            .leftJoin("projectComment.project", "project")
            .leftJoin("projectComment.user", "user")
            .where("project.id = :projectId", { projectId });

        if (queryString) {
            commentQuery.andWhere(
                new Brackets((qb) => {
                    qb.where("projectComment.content LIKE :queryString", { queryString: `%${queryString}%` })
                        .orWhere("user.firstName LIKE :queryString", { queryString: `%${queryString}%` })
                        .orWhere("user.lastName LIKE :queryString", { queryString: `%${queryString}%` });
                }),
            );
        }

        const queryResult = await commentQuery.getRawMany();

        return { isQueried: Boolean(queryString), queryResult };
    }

    async updateCommentContent(user: User, commentId: string, content: string): Promise<void> {
        const query = this.projectCommentRepository.createQueryBuilder("projectComment");

        query.leftJoinAndSelect("projectComment.user", "user").where("projectComment.id = :commentId", { commentId });

        const found = await query.getOne();

        if (!found) {
            throw new NotFoundException(`Project comment with id "${commentId}" is not found.`);
        }

        if (found.user.id !== user.id) {
            throw new UnauthorizedException(`Project comment with id "${commentId}" is written by another user.`);
        }

        found.content = content;

        const now = new Date();
        found.modifiedAt = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds(),
            ),
        );

        await this.projectCommentRepository.save(found);
    }

    async updateCommentFixStatus(user: User, commentId: string, pinned: boolean): Promise<{ pinnedStatus: boolean }> {
        const query = this.projectCommentRepository.createQueryBuilder("projectComment");

        query
            .leftJoinAndSelect("projectComment.project", "project")
            .leftJoinAndSelect("project.userToProjects", "userToProjects")
            .leftJoinAndSelect("userToProjects.user", "user")
            .where("projectComment.id = :commentId", { commentId });

        const found = await query.getOne();

        if (!found) {
            throw new NotFoundException(`Project comment with id "${commentId}" is not found.`);
        }

        let right: UserRight = null;

        found.project.userToProjects.forEach((member: UserToProject) => {
            if (member.user.id === user.id) {
                right = member.userRight;
            }
        });

        if (!right) {
            throw new UnauthorizedException(
                `You "${user.email}" are not member of this project with id "${found.project.id}".`,
            );
        }

        if (right !== UserRight.ADMIN) {
            throw new UnauthorizedException(
                `You "${user.email}" are not admin of this project with id "${found.project.id}".`,
            );
        }

        found.pinned = pinned;

        await this.projectCommentRepository.save(found);

        return { pinnedStatus: pinned };
    }

    async deleteComment(user: User, commentId: string): Promise<void> {
        const query = this.projectCommentRepository.createQueryBuilder("projectComment");

        query.leftJoinAndSelect("projectComment.user", "user").where("projectComment.id = :commentId", { commentId });

        const found = await query.getOne();

        if (!found) {
            throw new NotFoundException(`Project comment with id "${commentId}" is not found.`);
        }

        if (found.user.id !== user.id) {
            throw new UnauthorizedException(
                `You "${user.email}" are not the one who wrote this comment "${commentId}".`,
            );
        }

        if (found.pinned) {
            throw new BadRequestException(
                `This project comment "${commentId}" is pinned. Pinned comment cannot be removed.`,
            );
        }

        await this.projectCommentRepository.delete({ id: commentId });
    }
}
