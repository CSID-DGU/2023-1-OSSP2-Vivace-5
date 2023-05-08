import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
    ValidationPipe,
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { User } from "src/entity/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/user/get-user.decorator";
import { ProjectInfoValidationPipe } from "../pipe/project-info-validation.pipe";
import { MemberDto, ProjectInfoDto } from "./dto/project-info.dto";
import { Project } from "../entity/project.entity";
import { EncodedImgValidationPipe } from "../pipe/encoded-img-validation.pipe";
import { ProjectComment } from "src/entity/project-comment.entity";
import { UUIDValidationPipe } from "src/pipe/uuid-validation.pipe";
import { BooleanValidationPipe } from "src/pipe/boolean-validation.pipe";
import { IsNotEmptyStringPipe } from "src/pipe/is-not-empty-string.pipe";

@Controller("project")
@UseGuards(AuthGuard())
export class ProjectController {
    private logger = new Logger("ProjectController");

    constructor(private projectService: ProjectService) {}

    @Get("/")
    getAllProjects(@GetUser() user: User, @Query("q") query: string): Promise<Project[]> {
        this.logger.verbose(`User "${user.email}" trying to get his or her project list.`);
        return this.projectService.getAllProjects(user, query);
    }

    @Get("/:id")
    getProjectInfo(@GetUser() user: User, @Param("id", UUIDValidationPipe) projectId: string) {
        this.logger.verbose(`User "${user.email}" trying to get the info of project "${projectId}".`);
        return this.projectService.getProjectInfo(user, projectId);
    }

    @Post("/create")
    createProject(
        @GetUser() user: User,
        @Body(ValidationPipe, ProjectInfoValidationPipe, EncodedImgValidationPipe) projectInfoDto: ProjectInfoDto,
    ): Promise<{ notFoundUserId: string[] }> {
        this.logger.verbose(`User "${user.email}" trying to create project.`);
        return this.projectService.createProject(user, projectInfoDto);
    }

    @Put("/update/:id")
    updateProject(
        @GetUser() user: User,
        @Param("id") projectId: string,
        @Body(ValidationPipe, ProjectInfoValidationPipe, EncodedImgValidationPipe) projectInfoDto: ProjectInfoDto,
    ): Promise<{ notFoundUserId: string[] }> {
        this.logger.verbose(`User "${user.email}" trying to update project "${projectId}".`);
        return this.projectService.updateProject(user, projectId, projectInfoDto);
    }

    @Delete("/delete/:id")
    deleteProject(@GetUser() user: User, @Param("id") projectId: string): Promise<void> {
        this.logger.verbose(`User "${user.email}" trying to delete project "${projectId}".`);
        return this.projectService.deleteProject(user, projectId);
    }

    @Patch("/invite/:id")
    invite(
        @GetUser() user: User,
        @Param("id") projectId: string,
        @Body("members", ValidationPipe) members: MemberDto[],
    ): Promise<{ notFoundUserId: string[]; alreadyMemberUserId: string[] }> {
        this.logger.verbose(`User "${user.email}" trying to invite some people into project "${projectId}".`);
        return this.projectService.invite(user, projectId, members);
    }

    @Patch("/dismiss/:id")
    dismiss(
        @GetUser() user: User,
        @Param("id") projectId: string,
        @Body("members", ValidationPipe) members: string[],
    ): Promise<{ notFoundUserId: string[]; alreadyNotMemberUserId: string[]; adminUserId: string[] }> {
        this.logger.verbose(`User "${user.email}" trying to dismiss some members from this project "${projectId}".`);
        return this.projectService.dismiss(user, projectId, members);
    }

    @Delete("/withdraw/:id")
    withdraw(@GetUser() user: User, @Param("id") projectId: string): Promise<void> {
        this.logger.verbose(`User "${user.email}" trying to withdraw from this project "${projectId}".`);
        return this.projectService.withdraw(user, projectId);
    }

    @Post("/comment/:id")
    addCommment(
        @GetUser() user: User,
        @Param("id", UUIDValidationPipe) projectId: string,
        @Body("content", IsNotEmptyStringPipe) content: string,
    ): Promise<void> {
        this.logger.verbose(`User "${user.email}" trying to comment on this project "${projectId}".`);
        return this.projectService.addComment(user, projectId, content);
    }

    @Post("/reply/:commentId")
    addReply(
        @GetUser() user: User,
        @Param("commentId", UUIDValidationPipe) commentId: string,
        @Body("content", IsNotEmptyStringPipe) content: string,
    ): Promise<void> {
        this.logger.verbose(`User "${user.email}" trying to reply on the comment "${commentId}".`);
        return this.projectService.addReply(user, commentId, content);
    }

    @Get("/comment/:id")
    getAllComments(
        @GetUser() user: User,
        @Param("id", UUIDValidationPipe) projectId: string,
        @Query("q") query: string,
    ): Promise<{ isQueried: boolean; queryResult: ProjectComment[] }> {
        this.logger.verbose(`User "${user.email}" trying to get all comments of this project "${projectId}".`);
        return this.projectService.getAllComments(user, projectId, query);
    }

    @Patch("/comment/update/content/:id")
    updateCommentContent(
        @GetUser() user: User,
        @Param("id", UUIDValidationPipe) commentId: string,
        @Body("content", IsNotEmptyStringPipe) content: string,
    ): Promise<void> {
        this.logger.verbose(
            `User "${user.email}" trying to update content of the comment "${commentId}" in this project.`,
        );
        return this.projectService.updateCommentContent(user, commentId, content);
    }

    @Patch("/comment/update/fixed/:id")
    updateCommentPinStatus(
        @GetUser() user: User,
        @Param("id", UUIDValidationPipe) commentId: string,
        @Body("pinned", BooleanValidationPipe) pinned: boolean,
    ): Promise<{ pinnedStatus: boolean }> {
        this.logger.verbose(
            `User "${user.email}" trying to update pin status of the comment "${commentId}" in this project.`,
        );
        return this.projectService.updateCommentFixStatus(user, commentId, pinned);
    }

    @Delete("/comment/delete/:id")
    deleteComment(@GetUser() user: User, @Param("id", UUIDValidationPipe) commentId: string): Promise<void> {
        this.logger.verbose(`User "${user.email}" trying to delete the comment "${commentId}" in this project.`);
        return this.projectService.deleteComment(user, commentId);
    }
}
