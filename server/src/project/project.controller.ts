import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    ParseBoolPipe,
    ParseUUIDPipe,
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
import { GetUser } from "src/decorator/get-user.decorator";
import { ProjectInfoValidationPipe } from "../pipe/project-info-validation.pipe";
import { MemberDto, ProjectInfoDto } from "./dto/project-info.dto";
import { Project } from "../entity/project.entity";
import { EncodedImgValidationPipe } from "../pipe/encoded-img-validation.pipe";
import { ProjectComment } from "src/entity/project-comment.entity";
import { NotEmptyStringValidationPipe } from "src/pipe/not-empty-string-validation.pipe";
import {
    ApiTags,
    ApiOperation,
    ApiOkResponse,
    ApiBearerAuth,
    ApiQuery,
    ApiParam,
    ApiNotFoundResponse,
    ApiUnauthorizedResponse,
    ApiBody,
    ApiBadRequestResponse,
} from "@nestjs/swagger";
import { SubTask } from "src/enum/sub-task.enum";
import { UserRight } from "src/enum/user-right.enum";

@Controller("project")
@UseGuards(AuthGuard())
@ApiTags("Project API")
@ApiBearerAuth("access-token")
export class ProjectController {
    private logger = new Logger("ProjectController");

    constructor(private projectService: ProjectService) {}

    @Get("/")
    @ApiOperation({
        summary: "Get all projects",
        description: "Get all projects to which the user belongs",
    })
    @ApiOkResponse({
        description: "Return an array of projects",
        schema: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    description: { type: "string" },
                    type: { type: "enum", enum: [SubTask.GRAPH, SubTask.KANBAN, SubTask.LIST, SubTask.TERMINAL] },
                    encodedImg: { type: "string" },
                    userToProjects: {
                        type: "object",
                        properties: {
                            right: {
                                type: "enum",
                                enum: [
                                    UserRight.ADMIN,
                                    UserRight.COMPLETION_MOD,
                                    UserRight.MEMBER_AND_TASK_MGT,
                                    UserRight.MEMBER_MGT,
                                    UserRight.TASK_MGT,
                                ],
                            },
                        },
                    },
                },
            },
        },
    })
    @ApiQuery({ name: "q", type: "string", description: "query string", required: false })
    getAllProjects(@GetUser() user: User, @Query("q") query: string): Promise<Project[]> {
        this.logger.verbose(`User "${user.email}" trying to get his or her project list.`);
        return this.projectService.getAllProjects(user, query);
    }

    @Get("/:id")
    @ApiOperation({
        summary: "Get project information",
        description: "Get the information for the project specified by the project ID.",
    })
    @ApiOkResponse({
        description: "Return an object to explain the project information",
        schema: {
            type: "object",
            properties: {
                title: { type: "string" },
                description: { type: "string" },
                type: { type: "enum", enum: [SubTask.GRAPH, SubTask.KANBAN, SubTask.LIST, SubTask.TERMINAL] },
                encodedImg: { type: "string" },
                createdAt: { type: "string", description: "UTC time format" },
                userToProjects: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            right: {
                                type: "enum",
                                enum: [
                                    UserRight.ADMIN,
                                    UserRight.COMPLETION_MOD,
                                    UserRight.MEMBER_AND_TASK_MGT,
                                    UserRight.MEMBER_MGT,
                                    UserRight.TASK_MGT,
                                ],
                            },
                            user: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    firstName: { type: "string" },
                                    lastName: { type: "string" },
                                    encodedImg: { type: "string" },
                                },
                            },
                        },
                    },
                },
                tasks: { type: "array", items: { type: "object" } },
                comments: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            createdAt: { type: "string", description: "UTC time format" },
                            modifiedAt: { type: "string", description: "UTC time format" },
                            content: { type: "string" },
                            pinned: { type: "boolean" },
                            projectId: { type: "string" },
                        },
                    },
                },
            },
        },
    })
    @ApiNotFoundResponse({
        description: "If there is no project for the received project ID, return the Not Found error.",
    })
    @ApiUnauthorizedResponse({
        description:
            "If the user who sent the request is not a member of this project, the user is not eligible to view the information. So, returns an unauthorized error.",
    })
    @ApiParam({ name: "id", type: "string", description: "project UUID" })
    getProjectInfo(@GetUser() user: User, @Param("id", ParseUUIDPipe) projectId: string): Promise<Project> {
        this.logger.verbose(`User "${user.email}" trying to get the info of project "${projectId}".`);
        return this.projectService.getProjectInfo(user, projectId);
    }

    @Post("/create")
    @ApiOperation({
        summary: "Create a project",
        description: "Create a project",
    })
    @ApiOkResponse({
        description:
            "Return an array of user IDs that are not users of this site among the user IDs transmitted in the request.",
        schema: {
            type: "object",
            properties: {
                notFoundUserId: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
            },
        },
    })
    createProject(
        @GetUser() user: User,
        @Body(ValidationPipe, ProjectInfoValidationPipe, EncodedImgValidationPipe) projectInfoDto: ProjectInfoDto,
    ): Promise<{ notFoundUserId: string[] }> {
        this.logger.verbose(`User "${user.email}" trying to create project.`);
        return this.projectService.createProject(user, projectInfoDto);
    }

    @Put("/update/:id")
    @ApiOperation({
        summary: "Update project informations",
        description: "Update the information for the project specified by the project ID.",
    })
    @ApiOkResponse({
        description:
            "Return an array of user IDs that are not users of this site among the user IDs transmitted in the request.",
        schema: {
            type: "object",
            properties: {
                notFoundUserId: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
            },
        },
    })
    @ApiNotFoundResponse({
        description: "If there is no project for the received project ID, return the Not Found error.",
    })
    @ApiUnauthorizedResponse({
        description: "If the user is not the ADMIN of the project, return the Unauthorized error.",
    })
    @ApiParam({ name: "id", type: "string", description: "project UUID" })
    updateProject(
        @GetUser() user: User,
        @Param("id") projectId: string,
        @Body(ValidationPipe, ProjectInfoValidationPipe, EncodedImgValidationPipe) projectInfoDto: ProjectInfoDto,
    ): Promise<{ notFoundUserId: string[] }> {
        this.logger.verbose(`User "${user.email}" trying to update project "${projectId}".`);
        return this.projectService.updateProject(user, projectId, projectInfoDto);
    }

    @Delete("/delete/:id")
    @ApiOperation({
        summary: "Delete project",
        description: "Delete the project specified by the project ID.",
    })
    @ApiOkResponse({
        description: "Return nothing",
    })
    @ApiNotFoundResponse({
        description: "If there is no project for the received project ID, return the Not Found error.",
    })
    @ApiUnauthorizedResponse({
        description: "If the user is not the ADMIN of the project, return the Unauthorized error.",
    })
    @ApiParam({ name: "id", type: "string", description: "project UUID" })
    deleteProject(@GetUser() user: User, @Param("id") projectId: string): Promise<void> {
        this.logger.verbose(`User "${user.email}" trying to delete project "${projectId}".`);
        return this.projectService.deleteProject(user, projectId);
    }

    @Patch("/invite/:id")
    @ApiOperation({
        summary: "Invite people",
        description: "Invite people to the project specified by the project ID.",
    })
    @ApiOkResponse({
        description:
            "Return an array of user IDs that are not users of this site and already members of this project among the user IDs transmitted in the request.",
        schema: {
            type: "object",
            properties: {
                notFoundUserId: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
                alreadyMemberUserId: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
            },
        },
    })
    @ApiNotFoundResponse({
        description: "If there is no project for the received project ID, return the Not Found error.",
    })
    @ApiUnauthorizedResponse({
        description: "If you do not have permission to manage members of this project, return the Unauthorized error.",
    })
    @ApiParam({ name: "id", type: "string", description: "project UUID" })
    invite(
        @GetUser() user: User,
        @Param("id") projectId: string,
        @Body("members", ValidationPipe) members: MemberDto[],
    ): Promise<{ notFoundUserId: string[]; alreadyMemberUserId: string[] }> {
        this.logger.verbose(`User "${user.email}" trying to invite some people into project "${projectId}".`);
        return this.projectService.invite(user, projectId, members);
    }

    @Patch("/dismiss/:id")
    @ApiOperation({
        summary: "Dismiss members",
        description: "Dismiss members from the project specified by the project ID.",
    })
    @ApiOkResponse({
        description:
            "Return an array of user IDs that are not users of this site and not already members and ADMIN of this projectamong the user IDs transmitted in the request.",
        schema: {
            type: "object",
            properties: {
                notFoundUserId: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
                alreadyNotMemberUserId: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
                adminUserId: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
            },
        },
    })
    @ApiNotFoundResponse({
        description: "If there is no project for the received project ID, return the Not Found error.",
    })
    @ApiUnauthorizedResponse({
        description: "If you do not have permission to manage members of this project, return the Unauthorized error.",
    })
    @ApiParam({ name: "id", type: "string", description: "project UUID" })
    @ApiBody({
        description: "Receive an ID list of the members to be deported.",
        schema: {
            type: "object",
            properties: {
                members: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
            },
        },
    })
    dismiss(
        @GetUser() user: User,
        @Param("id") projectId: string,
        @Body("members", ValidationPipe) members: string[],
    ): Promise<{ notFoundUserId: string[]; alreadyNotMemberUserId: string[]; adminUserId: string[] }> {
        this.logger.verbose(`User "${user.email}" trying to dismiss some members from this project "${projectId}".`);
        return this.projectService.dismiss(user, projectId, members);
    }

    @Delete("/withdraw/:id")
    @ApiOperation({
        summary: "Withdraw the project",
        description: "Withdraw the project specified by the project ID.",
    })
    @ApiOkResponse({
        description: "Return nothing.",
    })
    @ApiNotFoundResponse({
        description: "If there is no project for the received project ID, return the Not Found error.",
    })
    @ApiUnauthorizedResponse({
        description: "If you are not member of the project or ADMIN of, return the Unauthorized error.",
    })
    @ApiParam({ name: "id", type: "string", description: "project UUID" })
    withdraw(@GetUser() user: User, @Param("id") projectId: string): Promise<void> {
        this.logger.verbose(`User "${user.email}" trying to withdraw from this project "${projectId}".`);
        return this.projectService.withdraw(user, projectId);
    }

    @Post("/comment/:id")
    @ApiOperation({
        summary: "Add comment on the project",
        description: "Add comment on the project specified by the project ID.",
    })
    @ApiOkResponse({
        description: "Return nothing.",
    })
    @ApiNotFoundResponse({
        description: "If there is no project for the received project ID, return the Not Found error.",
    })
    @ApiUnauthorizedResponse({
        description: "If you are not member of the project, return the Unauthorized error.",
    })
    @ApiParam({ name: "id", type: "string", description: "project UUID" })
    @ApiBody({
        description: "content of the comment",
        schema: {
            type: "object",
            properties: {
                content: { type: "string" },
            },
        },
    })
    addCommment(
        @GetUser() user: User,
        @Param("id", ParseUUIDPipe) projectId: string,
        @Body("content", NotEmptyStringValidationPipe) content: string,
    ): Promise<void> {
        this.logger.verbose(`User "${user.email}" trying to comment on this project "${projectId}".`);
        return this.projectService.addComment(user, projectId, content);
    }

    @Post("/reply/:commentId")
    @ApiOperation({
        summary: "Add reply on the comment",
        description: "Add reply on the comment specified by the comment ID.",
    })
    @ApiOkResponse({
        description: "Return nothing.",
    })
    @ApiNotFoundResponse({
        description: "If there is no comment for the received project comment ID, return the Not Found error.",
    })
    @ApiUnauthorizedResponse({
        description: "If you are not member of the project, return the Unauthorized error.",
    })
    @ApiParam({ name: "id", type: "string", description: "comment UUID" })
    @ApiBody({
        description: "content of the reply",
        schema: {
            type: "object",
            properties: {
                content: { type: "string" },
            },
        },
    })
    addReply(
        @GetUser() user: User,
        @Param("commentId", ParseUUIDPipe) commentId: string,
        @Body("content", NotEmptyStringValidationPipe) content: string,
    ): Promise<void> {
        this.logger.verbose(`User "${user.email}" trying to reply on the comment "${commentId}".`);
        return this.projectService.addReply(user, commentId, content);
    }

    @Get("/comment/:id")
    @ApiOperation({
        summary: "Get all comments",
        description: "Get all comments and replies on the project specified by the project ID.",
    })
    @ApiOkResponse({
        description: "Returns whether queried and an array of queried comments.",
        schema: {
            type: "object",
            properties: {
                isQueried: { type: "boolean" },
                queryResult: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            projectComment_id: { type: "string" },
                            projectComment_createdAt: { type: "string", description: "UTC time format" },
                            projectComment_modifiedAt: { type: "string", description: "UTC time format" },
                            projectComment_content: { type: "string" },
                            projectComment_pinned: { type: "boolean" },
                            projectComment_projectId: { type: "string" },
                            projectComment_parentId: { type: "string" },
                            projectComment_userId: { type: "string" },
                            user_id: { type: "string" },
                            user_firstName: { type: "string" },
                            user_lastName: { type: "string" },
                        },
                    },
                },
            },
        },
    })
    @ApiNotFoundResponse({
        description: "If there is no project for the received project ID, return the Not Found error.",
    })
    @ApiUnauthorizedResponse({
        description: "If you are not member of the project, return the Unauthorized error.",
    })
    @ApiParam({ name: "id", type: "string", description: "project UUID" })
    @ApiQuery({ name: "q", type: "string", required: false })
    getAllComments(
        @GetUser() user: User,
        @Param("id", ParseUUIDPipe) projectId: string,
        @Query("q") query: string,
    ): Promise<{ isQueried: boolean; queryResult: ProjectComment[] }> {
        this.logger.verbose(`User "${user.email}" trying to get all comments of this project "${projectId}".`);
        return this.projectService.getAllComments(user, projectId, query);
    }

    @Patch("/comment/update/content/:id")
    @ApiOperation({
        summary: "Update content of the comment",
        description: "Update content of the comment specified by the comment ID.",
    })
    @ApiOkResponse({
        description: "Returns nothing.",
    })
    @ApiNotFoundResponse({
        description: "If there is no comment for the received comment ID, return the Not Found error.",
    })
    @ApiUnauthorizedResponse({
        description: "If you didn't write the comment, return the Unauthorized error.",
    })
    @ApiParam({ name: "id", type: "string", description: "comment UUID" })
    @ApiBody({
        description: "content of the comment to update",
        schema: {
            type: "object",
            properties: {
                content: { type: "string" },
            },
        },
    })
    updateCommentContent(
        @GetUser() user: User,
        @Param("id", ParseUUIDPipe) commentId: string,
        @Body("content", NotEmptyStringValidationPipe) content: string,
    ): Promise<void> {
        this.logger.verbose(
            `User "${user.email}" trying to update content of the comment "${commentId}" in this project.`,
        );
        return this.projectService.updateCommentContent(user, commentId, content);
    }

    @Patch("/comment/update/fixed/:id")
    @ApiOperation({
        summary: "Switch whether the comment pinned or not",
        description: "Switch whether the comment specified by the comment ID pinned or not.",
    })
    @ApiOkResponse({
        description: "Returns changed pinned status.",
        schema: {
            type: "object",
            properties: {
                pinnedStatus: { type: "boolean" },
            },
        },
    })
    @ApiNotFoundResponse({
        description: "If there is no comment for the received comment ID, return the Not Found error.",
    })
    @ApiUnauthorizedResponse({
        description: "If you are not ADMIN of the project, return the Unauthorized error.",
    })
    @ApiParam({ name: "id", type: "string", description: "comment UUID" })
    @ApiBody({
        description: "content of the comment to update",
        schema: {
            type: "object",
            properties: {
                pinned: { type: "boolean" },
            },
        },
    })
    updateCommentPinStatus(
        @GetUser() user: User,
        @Param("id", ParseUUIDPipe) commentId: string,
        @Body("pinned", ParseBoolPipe) pinned: boolean,
    ): Promise<{ pinnedStatus: boolean }> {
        this.logger.verbose(
            `User "${user.email}" trying to update pin status of the comment "${commentId}" in this project.`,
        );
        return this.projectService.updateCommentFixStatus(user, commentId, pinned);
    }

    @Delete("/comment/delete/:id")
    @ApiOperation({
        summary: "Delete the comment",
        description: "Delete the comment specified by the comment ID.",
    })
    @ApiOkResponse({
        description: "Returns nothing.",
    })
    @ApiNotFoundResponse({
        description: "If there is no comment for the received comment ID, return the Not Found error.",
    })
    @ApiUnauthorizedResponse({
        description: "If you didn't write the comment, return the Unauthorized error.",
    })
    @ApiBadRequestResponse({
        description:
            "If the comment you want to delete is pinned, return a Bad Request error because it cannot be deleted.",
    })
    @ApiParam({ name: "id", type: "string", description: "comment UUID" })
    deleteComment(@GetUser() user: User, @Param("id", ParseUUIDPipe) commentId: string): Promise<void> {
        this.logger.verbose(`User "${user.email}" trying to delete the comment "${commentId}" in this project.`);
        return this.projectService.deleteComment(user, commentId);
    }
}
