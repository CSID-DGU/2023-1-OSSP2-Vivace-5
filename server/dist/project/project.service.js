"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const project_repository_1 = require("./project.repository");
const project_entity_1 = require("../entity/project.entity");
const user_to_project_entity_1 = require("../entity/user-to-project.entity");
const user_right_enum_1 = require("../enum/user-right.enum");
const user_to_project_repository_1 = require("./user-to-project.repository");
const project_comment_entity_1 = require("../entity/project-comment.entity");
const project_comment_repository_1 = require("./project-comment.repository");
const typeorm_2 = require("typeorm");
const task_repository_1 = require("../task/task.repository");
const user_repository_1 = require("../user/user.repository");
const project_content_entity_1 = require("../entity/project-content.entity");
const project_content_repository_1 = require("./project-content.repository");
let ProjectService = class ProjectService {
    constructor(projectRepository, userToProjectRepository, projectCommentRepository, taskRepository, userRepository, projectContentRepository) {
        this.projectRepository = projectRepository;
        this.userToProjectRepository = userToProjectRepository;
        this.projectCommentRepository = projectCommentRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.projectContentRepository = projectContentRepository;
    }
    async getAllProjects(user, queryString) {
        const query = this.projectRepository.createQueryBuilder("project");
        query
            .select([
            "project.id",
            "project.title",
            "project.description",
            "project.type",
            "userToProjects.right",
            "userToProjects.isBookmarked",
            "project.encodedImg",
        ])
            .innerJoin("project.userToProjects", "userToProjects")
            .where("userToProjects.userId = :userId", { userId: user.id })
            .orderBy("project.title", "ASC");
        if (queryString) {
            query.andWhere(new typeorm_2.Brackets((qb) => {
                qb.where("project.title LIKE :queryString", { queryString: `%${queryString}%` }).orWhere("project.description LIKE :queryString", { queryString: `%${queryString}%` });
            }));
        }
        const projects = await query.getMany();
        for (const project of projects) {
            const taskQuery = this.taskRepository.createQueryBuilder("task");
            taskQuery.where("task.projectId = :projectId", { projectId: project.id });
            const tasks = await taskQuery.getMany();
            let finishedTaskCount = 0;
            for (const task of tasks) {
                if (task.isFinished === true) {
                    ++finishedTaskCount;
                }
            }
            if (tasks.length !== 0) {
                project.progress = finishedTaskCount / tasks.length;
            }
            else {
                project.progress = 0;
            }
        }
        return projects;
    }
    async getAllBookmarkedProjects(user, queryString) {
        const query = this.projectRepository.createQueryBuilder("project");
        query
            .select(["project.id", "project.title", "project.encodedImg"])
            .innerJoin("project.userToProjects", "userToProjects")
            .where("userToProjects.userId = :userId", { userId: user.id })
            .andWhere("userToProjects.isBookmarked = :isBookmarked", { isBookmarked: true })
            .orderBy("project.title", "ASC");
        if (queryString) {
            query.andWhere(new typeorm_2.Brackets((qb) => {
                qb.where("project.title LIKE :queryString", { queryString: `%${queryString}%` }).orWhere("project.description LIKE :queryString", { queryString: `%${queryString}%` });
            }));
        }
        const bookmarkedProjects = await query.getMany();
        return bookmarkedProjects;
    }
    async getProjectInfo(user, projectId) {
        const query = this.projectRepository.createQueryBuilder("project");
        query
            .select([
            "project.title",
            "project.description",
            "project.type",
            "project.encodedImg",
            "project.createdAt",
            "userToProjects.right",
            "userToProjects.isBookmarked",
            "user.id",
            "user.encodedImg",
            "user.firstName",
            "user.lastName",
            "user.email",
            "task.id",
            "task.title",
            "task.description",
            "task.type",
            "task.milestone",
            "task.isFinished",
            "bookmark.title",
        ])
            .leftJoin("project.userToProjects", "userToProjects")
            .leftJoin("userToProjects.user", "user")
            .leftJoin("project.tasks", "task", "task.parentId IS NULL")
            .leftJoin("task.bookmarks", "bookmark", "bookmark.userId = :userId", { userId: user.id })
            .leftJoinAndSelect("task.predecessors", "predecessors")
            .leftJoinAndSelect("task.successors", "successors")
            .leftJoinAndSelect("project.comments", "comments")
            .where("project.id = :projectId", { projectId });
        const found = await query.getOne();
        if (!found) {
            throw new common_1.NotFoundException(`Project with id "${projectId}" is not found.`);
        }
        let includeUser = false;
        found.userToProjects.forEach((member) => {
            if (member.user.id === user.id) {
                includeUser = true;
            }
        });
        if (!includeUser) {
            throw new common_1.UnauthorizedException(`You "${user.email}" are not authorized to view the information on this project. Join this project for this information.`);
        }
        for (const task of found.tasks) {
            let descendants = await this.taskRepository.findDescendants(task);
            let nowGoal = 0;
            for (const descendant of descendants) {
                if (descendant.isFinished) {
                    ++nowGoal;
                }
            }
            task.rate = nowGoal / descendants.length;
        }
        return found;
    }
    async createProject(user, projectInfoDto) {
        const { title, description, type, encodedImg, members } = projectInfoDto;
        const project = new project_entity_1.Project();
        project.title = title;
        project.description = description;
        project.type = type;
        project.encodedImg = encodedImg;
        project.comments = [];
        project.tasks = [];
        project.userToProjects = [];
        project.contents = [];
        const now = new Date();
        project.createdAt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
        await this.projectRepository.save(project);
        const userToProject = new user_to_project_entity_1.UserToProject();
        userToProject.right = user_right_enum_1.UserRight.ADMIN;
        userToProject.project = project;
        userToProject.user = user;
        userToProject.isBookmarked = false;
        await this.userToProjectRepository.save(userToProject);
        const notFoundUserId = [];
        for (const member of members) {
            const memberEntity = await this.userRepository.findOneBy({ id: member.memberId });
            if (memberEntity) {
                const memberToProject = new user_to_project_entity_1.UserToProject();
                memberToProject.right = member.right;
                memberToProject.project = project;
                memberToProject.user = memberEntity;
                memberToProject.isBookmarked = false;
                await this.userToProjectRepository.save(memberToProject);
            }
            else {
                notFoundUserId.push(member.memberId);
            }
        }
        return { notFoundUserId: notFoundUserId };
    }
    async updateProject(user, projectId, projectInfoDto) {
        const { title, description, encodedImg, members } = projectInfoDto;
        const query = this.projectRepository.createQueryBuilder("project");
        query
            .leftJoinAndSelect("project.userToProjects", "userToProjects")
            .leftJoinAndSelect("userToProjects.user", "user")
            .where("project.id =:projectId", { projectId });
        const found = await query.getOne();
        if (!found) {
            throw new common_1.NotFoundException(`Project with id "${projectId}" is not found.`);
        }
        let right = null;
        found.userToProjects.forEach((member) => {
            if (member.user.id === user.id) {
                right = member.right;
            }
        });
        if (right !== user_right_enum_1.UserRight.ADMIN) {
            throw new common_1.UnauthorizedException(`You "${user.email}" are not authorized to update the information on this project. Your right in this project is "${right}".`);
        }
        found.title = title;
        found.description = description;
        found.encodedImg = encodedImg;
        await this.projectRepository.save(found);
        for (const member of found.userToProjects) {
            await this.userToProjectRepository.delete({ id: member.id });
        }
        const userToProject = new user_to_project_entity_1.UserToProject();
        userToProject.right = right;
        userToProject.project = found;
        userToProject.user = user;
        await this.userToProjectRepository.save(userToProject);
        const notFoundUserId = [];
        for (const member of members) {
            const memberEntity = await this.userRepository.findOneBy({ id: member.memberId });
            if (memberEntity) {
                const memberToProject = new user_to_project_entity_1.UserToProject();
                memberToProject.right = member.right;
                memberToProject.project = found;
                memberToProject.user = memberEntity;
                await this.userToProjectRepository.save(memberToProject);
            }
            else {
                notFoundUserId.push(member.memberId);
            }
        }
        return { notFoundUserId: notFoundUserId };
    }
    async updateTitle(user, projectId, newTitle) {
        const query = this.projectRepository.createQueryBuilder("project");
        query
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .where("project.id = :projectId", { projectId });
        const found = await query.getOne();
        if (!found) {
            throw new common_1.NotFoundException(`Project with id "${projectId}" is not found.`);
        }
        if (found.userToProjects.length !== 1) {
            throw new common_1.UnauthorizedException(`User ${user.email} is not member of the project ${projectId}`);
        }
        const right = found.userToProjects[0].right;
        if (right !== user_right_enum_1.UserRight.ADMIN) {
            throw new common_1.UnauthorizedException(`You "${user.email}" are not authorized to update the title on this project. Your right in this project is "${right}".`);
        }
        await this.projectRepository.update({ id: projectId }, { title: newTitle });
    }
    async updateDescription(user, projectId, newDescription) {
        const query = this.projectRepository.createQueryBuilder("project");
        query
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .where("project.id = :projectId", { projectId });
        const found = await query.getOne();
        if (!found) {
            throw new common_1.NotFoundException(`Project with id "${projectId}" is not found.`);
        }
        if (found.userToProjects.length !== 1) {
            throw new common_1.UnauthorizedException(`User ${user.email} is not member of the project ${projectId}`);
        }
        const right = found.userToProjects[0].right;
        if (right !== user_right_enum_1.UserRight.ADMIN) {
            throw new common_1.UnauthorizedException(`You "${user.email}" are not authorized to update the title on this project. Your right in this project is "${right}".`);
        }
        await this.projectRepository.update({ id: projectId }, { description: newDescription });
    }
    async updateIcon(user, projectId, newIconBase64) {
        const query = this.projectRepository.createQueryBuilder("project");
        query
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .where("project.id = :projectId", { projectId });
        const found = await query.getOne();
        if (!found) {
            throw new common_1.NotFoundException(`Project with id "${projectId}" is not found.`);
        }
        if (found.userToProjects.length !== 1) {
            throw new common_1.UnauthorizedException(`User ${user.email} is not member of the project ${projectId}`);
        }
        const right = found.userToProjects[0].right;
        if (right !== user_right_enum_1.UserRight.ADMIN) {
            throw new common_1.UnauthorizedException(`You "${user.email}" are not authorized to update the title on this project. Your right in this project is "${right}".`);
        }
        await this.projectRepository.update({ id: projectId }, { encodedImg: newIconBase64 });
    }
    async updateBookmarkStatus(user, projectId, bookmarkStatus) {
        const query = this.projectRepository.createQueryBuilder("project");
        query
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .where("project.id = :projectId", { projectId });
        const found = await query.getOne();
        if (!found) {
            throw new common_1.NotFoundException(`Project with id "${projectId}" is not found.`);
        }
        if (found.userToProjects.length !== 1) {
            throw new common_1.UnauthorizedException(`User ${user.email} is not member of the project ${projectId}`);
        }
        await this.userToProjectRepository.update({ projectId, userId: user.id }, { isBookmarked: bookmarkStatus });
        return { bookmarkStatus };
    }
    async deleteProject(user, projectId) {
        const query = this.projectRepository.createQueryBuilder("project");
        query
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .where("project.id =:projectId", { projectId });
        const found = await query.getOne();
        if (!found) {
            throw new common_1.NotFoundException(`Project with id "${projectId}" is not found.`);
        }
        if (!found.userToProjects[0]) {
            throw new common_1.UnauthorizedException(`You "${user.email}" are not authorized to delete this project. Join this project for elimination.`);
        }
        const right = found.userToProjects[0].right;
        if (right === user_right_enum_1.UserRight.ADMIN) {
            await this.projectRepository.delete({ id: projectId });
        }
        else {
            throw new common_1.UnauthorizedException(`You "${user.email}" are not authorized to delete this project. Your right in this project is "${right}". Only an administrator can delete a project.`);
        }
    }
    async invite(user, projectId, members) {
        const query = this.projectRepository.createQueryBuilder("project");
        query
            .leftJoinAndSelect("project.userToProjects", "userToProjects")
            .leftJoinAndSelect("userToProjects.user", "user")
            .where("project.id =:projectId", { projectId });
        const foundProject = await query.getOne();
        if (!foundProject) {
            throw new common_1.NotFoundException(`Project with id "${projectId}" is not found.`);
        }
        let right = null;
        foundProject.userToProjects.forEach((member) => {
            if (member.user.id === user.id) {
                right = member.right;
            }
        });
        if (!right) {
            throw new common_1.UnauthorizedException(`You "${user.email}" are not authorized to invite people into this project. Join this project for invitation.`);
        }
        if (right === user_right_enum_1.UserRight.COMPLETION_MOD || right === user_right_enum_1.UserRight.TASK_MGT) {
            throw new common_1.UnauthorizedException(`You "${user.email}" are not authorized to invite people into this project. Your right in this project is "${right}".`);
        }
        const notFoundUserId = [];
        const alreadyMemberUserId = [];
        for (const member of members) {
            const memberEntity = await this.userRepository.findOneBy({ id: member.memberId });
            if (memberEntity) {
                const query = this.userToProjectRepository.createQueryBuilder("userToProject");
                query
                    .leftJoin("userToProject.user", "user")
                    .leftJoin("userToProject.project", "project")
                    .where("user.id = :userId", { userId: memberEntity.id })
                    .andWhere("project.id = :projectId", { projectId });
                const foundUser = await query.getOne();
                if (!foundUser) {
                    const memberToProject = new user_to_project_entity_1.UserToProject();
                    if (right === user_right_enum_1.UserRight.ADMIN) {
                        memberToProject.right = member.right;
                    }
                    else {
                        memberToProject.right = user_right_enum_1.UserRight.COMPLETION_MOD;
                    }
                    memberToProject.project = foundProject;
                    memberToProject.user = memberEntity;
                    memberToProject.isBookmarked = false;
                    await this.userToProjectRepository.save(memberToProject);
                }
                else {
                    alreadyMemberUserId.push(member.memberId);
                }
            }
            else {
                notFoundUserId.push(member.memberId);
            }
        }
        return { notFoundUserId, alreadyMemberUserId };
    }
    async dismiss(user, projectId, members) {
        const query = this.projectRepository.createQueryBuilder("project");
        query
            .leftJoinAndSelect("project.userToProjects", "userToProjects")
            .leftJoinAndSelect("userToProjects.user", "user")
            .where("project.id =:projectId", { projectId });
        const foundProject = await query.getOne();
        if (!foundProject) {
            throw new common_1.NotFoundException(`Project with id "${projectId}" is not found.`);
        }
        let right = null;
        foundProject.userToProjects.forEach((member) => {
            if (member.user.id === user.id) {
                right = member.right;
            }
        });
        if (!right) {
            throw new common_1.UnauthorizedException(`You "${user.email}" are not authorized to dismiss people from this project. Join this project for dismissal.`);
        }
        if (right === user_right_enum_1.UserRight.COMPLETION_MOD || right === user_right_enum_1.UserRight.TASK_MGT) {
            throw new common_1.UnauthorizedException(`You "${user.email}" are not authorized to dismiss people from this project. Your right in this project is "${right}".`);
        }
        const notFoundUserId = [];
        const alreadyNotMemberUserId = [];
        const adminUserId = [];
        for (const memberId of members) {
            const memberEntity = await this.userRepository.findOneBy({ id: memberId });
            if (memberEntity) {
                const query = this.userToProjectRepository.createQueryBuilder("userToProject");
                query
                    .leftJoin("userToProject.user", "user")
                    .leftJoin("userToProject.project", "project")
                    .where("user.id = :userId", { userId: memberEntity.id })
                    .andWhere("project.id = :projectId", { projectId });
                const foundUser = await query.getOne();
                if (foundUser) {
                    if (foundUser.right !== user_right_enum_1.UserRight.ADMIN || right === user_right_enum_1.UserRight.ADMIN) {
                        await this.userToProjectRepository.delete({ id: foundUser.id });
                    }
                    else {
                        adminUserId.push(memberId);
                    }
                }
                else {
                    alreadyNotMemberUserId.push(memberId);
                }
            }
            else {
                notFoundUserId.push(memberId);
            }
        }
        return { notFoundUserId, alreadyNotMemberUserId, adminUserId };
    }
    async withdraw(user, projectId) {
        const query = this.projectRepository.createQueryBuilder("project");
        query
            .leftJoinAndSelect("project.userToProjects", "userToProjects")
            .leftJoinAndSelect("userToProjects.user", "user")
            .where("project.id =:projectId", { projectId });
        const foundProject = await query.getOne();
        if (!foundProject) {
            throw new common_1.NotFoundException(`Project with id "${projectId}" is not found.`);
        }
        let right = null;
        let userToProject = null;
        foundProject.userToProjects.forEach((member) => {
            if (member.user.id === user.id) {
                right = member.right;
                userToProject = member;
            }
        });
        if (!userToProject) {
            throw new common_1.UnauthorizedException(`You "${user.email}" are not member of this project with id "${projectId}".`);
        }
        if (right === user_right_enum_1.UserRight.ADMIN) {
            throw new common_1.UnauthorizedException(`You "${user.email}" are administer of this project with id "${projectId}". You cannot withdraw this project.`);
        }
        await this.userToProjectRepository.delete({ id: userToProject.id });
    }
    async addComment(user, projectId, content) {
        const query = this.projectRepository.createQueryBuilder("project");
        query
            .leftJoinAndSelect("project.userToProjects", "userToProjects")
            .leftJoinAndSelect("userToProjects.user", "user")
            .where("project.id =:projectId", { projectId });
        const foundProject = await query.getOne();
        if (!foundProject) {
            throw new common_1.NotFoundException(`Project with id "${projectId}" is not found.`);
        }
        let userToProject = null;
        foundProject.userToProjects.forEach((member) => {
            if (member.user.id === user.id) {
                userToProject = member;
            }
        });
        if (!userToProject) {
            throw new common_1.UnauthorizedException(`You "${user.email}" are not member of this project with id "${projectId}".`);
        }
        const projectComment = new project_comment_entity_1.ProjectComment();
        const now = new Date();
        projectComment.createdAt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
        projectComment.modifiedAt = new Date(projectComment.createdAt.getTime());
        projectComment.content = content;
        projectComment.pinned = false;
        projectComment.isDeleted = false;
        projectComment.user = user;
        projectComment.project = foundProject;
        await this.projectCommentRepository.save(projectComment);
    }
    async addReply(user, commentId, content) {
        const query = this.projectCommentRepository.createQueryBuilder("projectComment");
        query
            .leftJoinAndSelect("projectComment.project", "project")
            .leftJoinAndSelect("project.userToProjects", "userToProjects")
            .leftJoinAndSelect("userToProjects.user", "user")
            .where("projectComment.id = :commentId", { commentId });
        const found = await query.getOne();
        if (!found) {
            throw new common_1.NotFoundException(`Project comment with id "${commentId}" is not found.`);
        }
        let isMember = false;
        found.project.userToProjects.forEach((member) => {
            if (member.user.id === user.id) {
                isMember = true;
            }
        });
        if (!isMember) {
            throw new common_1.UnauthorizedException(`You "${user.email}" are not member of this project with id "${found.project.id}".`);
        }
        const projectComment = new project_comment_entity_1.ProjectComment();
        const now = new Date();
        projectComment.createdAt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
        projectComment.modifiedAt = new Date(projectComment.createdAt.getTime());
        projectComment.content = content;
        projectComment.pinned = false;
        projectComment.isDeleted = false;
        projectComment.parent = found;
        projectComment.user = user;
        projectComment.project = found.project;
        await this.projectCommentRepository.save(projectComment);
    }
    async getAllComments(user, projectId, queryString) {
        const projectQuery = this.projectRepository.createQueryBuilder("project");
        projectQuery
            .leftJoinAndSelect("project.userToProjects", "userToProjects")
            .leftJoinAndSelect("userToProjects.user", "user")
            .where("project.id =:projectId", { projectId });
        const foundProject = await projectQuery.getOne();
        if (!foundProject) {
            throw new common_1.NotFoundException(`Project with id "${projectId}" is not found.`);
        }
        let isMember = false;
        foundProject.userToProjects.forEach((member) => {
            if (member.user.id === user.id) {
                isMember = true;
            }
        });
        if (!isMember) {
            throw new common_1.UnauthorizedException(`You "${user.email}" are not member of this project with id "${projectId}".`);
        }
        const commentQuery = this.projectCommentRepository.createQueryBuilder("projectComment");
        commentQuery
            .select(["projectComment", "user.id", "user.firstName", "user.lastName"])
            .leftJoin("projectComment.project", "project")
            .leftJoin("projectComment.user", "user")
            .where("project.id = :projectId", { projectId });
        if (queryString) {
            commentQuery.andWhere(new typeorm_2.Brackets((qb) => {
                qb.where("projectComment.content LIKE :queryString", { queryString: `%${queryString}%` })
                    .orWhere("user.firstName LIKE :queryString", { queryString: `%${queryString}%` })
                    .orWhere("user.lastName LIKE :queryString", { queryString: `%${queryString}%` });
            }));
        }
        const queryResult = await commentQuery.getRawMany();
        return { isQueried: Boolean(queryString), queryResult };
    }
    async updateCommentContent(user, commentId, content) {
        const query = this.projectCommentRepository.createQueryBuilder("projectComment");
        query.leftJoinAndSelect("projectComment.user", "user").where("projectComment.id = :commentId", { commentId });
        const found = await query.getOne();
        if (!found) {
            throw new common_1.NotFoundException(`Project comment with id "${commentId}" is not found.`);
        }
        if (found.user.id !== user.id) {
            throw new common_1.UnauthorizedException(`Project comment with id "${commentId}" is written by another user.`);
        }
        found.content = content;
        const now = new Date();
        found.modifiedAt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
        await this.projectCommentRepository.save(found);
    }
    async updateCommentFixStatus(user, commentId, pinned) {
        const query = this.projectCommentRepository.createQueryBuilder("projectComment");
        query
            .leftJoinAndSelect("projectComment.project", "project")
            .leftJoinAndSelect("project.userToProjects", "userToProjects")
            .leftJoinAndSelect("userToProjects.user", "user")
            .where("projectComment.id = :commentId", { commentId });
        const found = await query.getOne();
        if (!found) {
            throw new common_1.NotFoundException(`Project comment with id "${commentId}" is not found.`);
        }
        let right = null;
        found.project.userToProjects.forEach((member) => {
            if (member.user.id === user.id) {
                right = member.right;
            }
        });
        if (!right) {
            throw new common_1.UnauthorizedException(`You "${user.email}" are not member of this project with id "${found.project.id}".`);
        }
        if (right !== user_right_enum_1.UserRight.ADMIN) {
            throw new common_1.UnauthorizedException(`You "${user.email}" are not admin of this project with id "${found.project.id}".`);
        }
        found.pinned = pinned;
        await this.projectCommentRepository.save(found);
        return { pinnedStatus: pinned };
    }
    async getAllDocs(user, projectId) {
        const projectQuery = this.projectRepository.createQueryBuilder("project");
        projectQuery
            .leftJoinAndSelect("project.contents", "contents")
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .where("project.id = :projectId", { projectId });
        const project = await projectQuery.getOne();
        if (!project) {
            throw new common_1.NotFoundException(`Project ${projectId} is not found.`);
        }
        if (project.userToProjects.length <= 0) {
            throw new common_1.UnauthorizedException(`User ${user.email} is not member of the project ${projectId}.`);
        }
        return project.contents;
    }
    async createDocument(user, projectId) {
        const projectQuery = this.projectRepository.createQueryBuilder("project");
        projectQuery
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .where("project.id = :projectId", { projectId });
        const project = await projectQuery.getOne();
        if (!project) {
            throw new common_1.NotFoundException(`Project ${projectId} is not found.`);
        }
        if (project.userToProjects.length <= 0) {
            throw new common_1.UnauthorizedException(`User ${user.email} is not member of the project ${projectId}.`);
        }
        if (project.userToProjects[0].right === user_right_enum_1.UserRight.COMPLETION_MOD ||
            project.userToProjects[0].right === user_right_enum_1.UserRight.MEMBER_MGT) {
            throw new common_1.UnauthorizedException(`User ${user.email} has insufficient permission for creating project document in this project with id ${projectId}.`);
        }
        const newContent = new project_content_entity_1.ProjectContent();
        newContent.title = "New Document";
        const now = new Date();
        newContent.createdAt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
        newContent.modifiedAt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
        newContent.content = "";
        newContent.project = project;
        await this.projectContentRepository.save(newContent);
    }
    async updateDocTitle(user, projectId, updateDocTitleDto) {
        const { docId, newTitle } = updateDocTitleDto;
        const projectQuery = this.projectRepository.createQueryBuilder("project");
        projectQuery
            .leftJoinAndSelect("project.contents", "contents", "contents.id = :docId", { docId })
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .where("project.id = :projectId", { projectId });
        const project = await projectQuery.getOne();
        if (!project) {
            throw new common_1.NotFoundException(`Project ${projectId} is not found.`);
        }
        if (project.userToProjects.length <= 0) {
            throw new common_1.UnauthorizedException(`User ${user.email} is not member of the project ${projectId}.`);
        }
        if (project.contents.length <= 0) {
            throw new common_1.NotFoundException(`Document ${docId} is not found in the project ${projectId}.`);
        }
        if (project.userToProjects[0].right === user_right_enum_1.UserRight.COMPLETION_MOD ||
            project.userToProjects[0].right === user_right_enum_1.UserRight.MEMBER_MGT) {
            throw new common_1.UnauthorizedException(`User ${user.email} has insufficient permission for creating project document in this project with id ${projectId}.`);
        }
        await this.projectContentRepository.update({ id: docId }, { title: newTitle });
    }
    async updateDocContent(user, projectId, updateDocContentDto) {
        const { docId, newContent } = updateDocContentDto;
        const projectQuery = this.projectRepository.createQueryBuilder("project");
        projectQuery
            .leftJoinAndSelect("project.contents", "contents", "contents.id = :docId", { docId })
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .where("project.id = :projectId", { projectId });
        const project = await projectQuery.getOne();
        if (!project) {
            throw new common_1.NotFoundException(`Project ${projectId} is not found.`);
        }
        if (project.userToProjects.length <= 0) {
            throw new common_1.UnauthorizedException(`User ${user.email} is not member of the project ${projectId}.`);
        }
        if (project.contents.length <= 0) {
            throw new common_1.NotFoundException(`Document ${docId} is not found in the project ${projectId}.`);
        }
        if (project.userToProjects[0].right === user_right_enum_1.UserRight.COMPLETION_MOD ||
            project.userToProjects[0].right === user_right_enum_1.UserRight.MEMBER_MGT) {
            throw new common_1.UnauthorizedException(`User ${user.email} has insufficient permission for creating project document in this project with id ${projectId}.`);
        }
        const now = new Date();
        await this.projectContentRepository.update({ id: docId }, {
            content: newContent,
            modifiedAt: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds())),
        });
    }
    async deleteDocument(user, projectId, docId) {
        const projectQuery = this.projectRepository.createQueryBuilder("project");
        projectQuery
            .leftJoinAndSelect("project.contents", "contents", "contents.id = :docId", { docId })
            .leftJoinAndSelect("project.userToProjects", "userToProjects", "userToProjects.userId = :userId", {
            userId: user.id,
        })
            .where("project.id = :projectId", { projectId });
        const project = await projectQuery.getOne();
        if (!project) {
            throw new common_1.NotFoundException(`Project ${projectId} is not found.`);
        }
        if (project.userToProjects.length <= 0) {
            throw new common_1.UnauthorizedException(`User ${user.email} is not member of the project ${projectId}.`);
        }
        if (project.contents.length <= 0) {
            throw new common_1.NotFoundException(`Document ${docId} is not found in the project ${projectId}.`);
        }
        if (project.userToProjects[0].right === user_right_enum_1.UserRight.COMPLETION_MOD ||
            project.userToProjects[0].right === user_right_enum_1.UserRight.MEMBER_MGT) {
            throw new common_1.UnauthorizedException(`User ${user.email} has insufficient permission for creating project document in this project with id ${projectId}.`);
        }
        await this.projectContentRepository.delete({ id: docId });
    }
    async deleteComment(user, commentId) {
        const query = this.projectCommentRepository.createQueryBuilder("projectComment");
        query.leftJoinAndSelect("projectComment.user", "user").where("projectComment.id = :commentId", { commentId });
        const found = await query.getOne();
        if (!found) {
            throw new common_1.NotFoundException(`Project comment with id "${commentId}" is not found.`);
        }
        if (found.user.id !== user.id) {
            throw new common_1.UnauthorizedException(`You "${user.email}" are not the one who wrote this comment "${commentId}".`);
        }
        if (found.pinned) {
            throw new common_1.BadRequestException(`This project comment "${commentId}" is pinned. Pinned comment cannot be removed.`);
        }
        await this.projectCommentRepository.delete({ id: commentId });
    }
};
ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_repository_1.ProjectRepository)),
    __param(1, (0, typeorm_1.InjectRepository)(user_to_project_repository_1.UserToProjectRepository)),
    __param(2, (0, typeorm_1.InjectRepository)(project_comment_repository_1.ProjectCommentRepository)),
    __param(3, (0, typeorm_1.InjectRepository)(task_repository_1.TaskRepository)),
    __param(4, (0, typeorm_1.InjectRepository)(user_repository_1.UserRepository)),
    __param(5, (0, typeorm_1.InjectRepository)(project_content_repository_1.ProjectContentRepository)),
    __metadata("design:paramtypes", [project_repository_1.ProjectRepository,
        user_to_project_repository_1.UserToProjectRepository,
        project_comment_repository_1.ProjectCommentRepository,
        task_repository_1.TaskRepository,
        user_repository_1.UserRepository,
        project_content_repository_1.ProjectContentRepository])
], ProjectService);
exports.ProjectService = ProjectService;
//# sourceMappingURL=project.service.js.map