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
    UseGuards,
    ValidationPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./get-user.decorator";
import { User } from "../entity/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { UserInfo } from "./user-info.interface";
import { EncodedImgValidationPipe } from "src/pipe/encoded-img-validation.pipe";
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ConfirmPasswordDto } from "./dto/confirm-password.dto";

@Controller("user")
@ApiTags("User API")
export class UserController {
    private logger = new Logger("UserController");

    constructor(private userService: UserService) {}

    @Post("/signup")
    @ApiOperation({
        summary: "Sign up API",
        description: "Sign up",
    })
    @ApiCreatedResponse({
        description: "성공여부",
        schema: {
            example: { success: true },
        },
    })
    signUp(@Body(ValidationPipe, EncodedImgValidationPipe) signUpDto: SignUpDto): Promise<void> {
        this.logger.verbose(`"${signUpDto.email}" trying to sign up.`);
        return this.userService.signUp(signUpDto);
    }

    @Post("/signin")
    @ApiOperation({
        summary: "Sign in API",
        description: "이메일와 비밀번호를 통해 sign in 진행",
    })
    @ApiCreatedResponse({
        description: "로그인 정보",
        schema: {
            example: {
                accessToken:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdkaG9uZ0Bkb25nZ3VrLmVkdSIsImlhdCI6MTY4MzgxODU2MiwiZXhwIjoxNjgzODIyMTYyfQ.jyDv32VcI9PxNi86xADL4wUhHGuu2sJz2rvjxbrDgpc",
            },
        },
    })
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        this.logger.verbose(`"${authCredentialsDto.email}" trying to sign in.`);
        return this.userService.signIn(authCredentialsDto);
    }

    @Get("/info")
    @UseGuards(AuthGuard())
    @ApiBearerAuth("access-token")
    @ApiOperation({
        summary: "로그인한 유저 정보 조회 API"
    })
    @ApiCreatedResponse({
        description: "성공여부",
        schema: {
            example: {
                success: true,
                data: [
                    {
                        "id": "d504d88f-c7cf-4a39-afa3-57ae5164dc72",
                        "firstName": "Gildong",
                        "lastName": "Hong",
                        "email": "gdhong@dongguk.edu",
                        "year": 1998,
                        "month": 2,
                        "date": 14,
                        "belong": "동국대학교",
                        "country": "Republic of Korea",
                        "region": "Seoul",
                        "encodedImg": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAT1JREFUeNrsV0kKwjAQxNeD13tRd7VjICJKSiZpOUVZiMtbjKqB3MhBxjo2VnYWFB0YAl1YZdj4JZKjQRBQ0FAUcR8kS5jxue5m5z5/44vY8e6WZ/6BZj/HPgAlVIkQXoWxUHLYMmkjKUkY6UJW6jo+xlZfKys6uxqvvevX2J6scop+6phbBWWzgVRJ3q4LzJZ/KQ2Z+JWMRnXbS9xTR5GpwAAAABJRU5ErkJggg==",
                        "createdAt": "2023-05-11T14:16:09.000Z"
                      },
                ],
            },
        },
    })
    getMyInfo(@GetUser() user: User): UserInfo {
        this.logger.verbose(`"${user.email}" trying to get personal information.`);
        return this.userService.extractPublicInfo(user);
    }

    @Get("/info/:id")
    @UseGuards(AuthGuard())
    @ApiBearerAuth("access-token")
    @ApiOperation({
        summary: "아이디를 통해 원하는 유저 정보 조회 API"
    })
    getUserInfo(@Param("id") userId: string): Promise<UserInfo> {
        this.logger.verbose(`User trying to get information of "${userId}".`);
        return this.userService.getUserInfo(userId);
    }

    @Put("/update/info")
    @UseGuards(AuthGuard())
    @ApiBearerAuth("access-token")
    @ApiOperation({
        summary: "유저 정보 변경 API"
    })
    updateUser(
        @GetUser() user: User,
        @Body(ValidationPipe, EncodedImgValidationPipe) updateUserDto: UpdateUserDto,
    ): Promise<void> {
        this.logger.verbose(`"${user.email}" trying to update personal information.`);
        return this.userService.updateUser(user, updateUserDto);
    }

    @Patch("/update/password")
    @UseGuards(AuthGuard())
    @ApiBearerAuth("access-token")
    @ApiOperation({
        summary: "비밀번호 변경 API"
    })
    updatePassword(@GetUser() user: User, @Body(ValidationPipe) updatePasswordDto: UpdatePasswordDto): Promise<void> {
        this.logger.verbose(`"${user.email}" trying to update password.`);
        return this.userService.updatePassword(user, updatePasswordDto);
    }

    @Delete("/withdraw")
    @UseGuards(AuthGuard())
    @ApiBearerAuth("access-token")
    @ApiOperation({
        summary: "유저 탈퇴 API"
    })
    withdraw(@GetUser() user: User, @Body(ValidationPipe) confirmPasswordDto: ConfirmPasswordDto): Promise<void> {
        this.logger.verbose(`"${user.email}" trying to withdraw from this service.`);
        return this.userService.withdraw(user, confirmPasswordDto);
    }
}
