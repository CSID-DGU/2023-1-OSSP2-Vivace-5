import { UserService } from "./user.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "../entity/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ConfirmPasswordDto } from "./dto/update-password.dto";
import { UserInfo } from "./user-info.interface";
export declare class UserController {
    private userService;
    private logger;
    constructor(userService: UserService);
    signUp(signUpDto: SignUpDto): Promise<void>;
    signIn(authCredentialsDto: AuthCredentialsDto): Promise<{
        accessToken: string;
    }>;
    getMyInfo(user: User): UserInfo;
    getUserInfo(userId: string): Promise<UserInfo>;
    updateUser(user: User, updateUserDto: UpdateUserDto): Promise<void>;
    updatePassword(user: User, confirmPasswordDto: ConfirmPasswordDto): Promise<void>;
    withdraw(user: User, confirmPasswordDto: ConfirmPasswordDto): Promise<void>;
}
