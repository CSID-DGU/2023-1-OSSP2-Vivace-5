import {
    Injectable,
    InternalServerErrorException,
    NotAcceptableException,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { SignUpDto } from "./dto/sign-up.dto";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { User } from "../entity/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ConfirmPasswordDto } from "./dto/update-password.dto";
import { UserInfo } from "./user-info.interface";
import { DeleteResult } from "typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<void> {
        return this.userRepository.createUser(signUpDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { email, password } = authCredentialsDto;
        const user = await this.userRepository.findOneBy({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const payload = { email };
            const accessToken = this.jwtService.sign(payload);

            return { accessToken };
        } else {
            throw new UnauthorizedException("Login failed");
        }
    }

    async getUserEntity(id: string): Promise<User> {
        return this.userRepository.findOneBy({ id });
    }

    async saveUserEntity(user: User): Promise<void> {
        await this.userRepository.save(user);
    }

    extractPublicInfo(user: User): UserInfo {
        const userInfo: UserInfo = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            year: user.year,
            month: user.month,
            date: user.date,
            belong: user.belong,
            country: user.country,
            region: user.region,
            encodedImg: user.encodedImg,
            createdAt: user.createdAt,
        };

        return userInfo;
    }

    async getUserInfo(id: string): Promise<UserInfo> {
        const user = await this.getUserEntity(id);

        if (!user) {
            throw new NotFoundException(`User ${id} is not found.`);
        }

        return this.extractPublicInfo(user);
    }

    async updateUser(user: User, updateUserDto: UpdateUserDto): Promise<void> {
        user.firstName = updateUserDto.firstName;
        user.lastName = updateUserDto.lastName;
        user.year = updateUserDto.year;
        user.month = updateUserDto.month;
        user.date = updateUserDto.date;
        user.belong = updateUserDto.belong;
        user.country = updateUserDto.country;
        user.region = updateUserDto.region;
        user.encodedImg = updateUserDto.encodedImg;

        await this.userRepository.save(user);
    }

    async updatePassword(user: User, updatePasswordDto: ConfirmPasswordDto): Promise<void> {
        const { before, after } = updatePasswordDto;

        if (before === after) {
            throw new NotAcceptableException("The password you want to change is the same as before.");
        }

        const salt: string = await bcrypt.genSalt();
        const hashedPassword: string = await bcrypt.hash(after, salt);

        user.password = hashedPassword;

        await this.userRepository.save(user);
    }

    async withdraw(user: User, confirmPasswordDto: ConfirmPasswordDto): Promise<void> {
        const { before, after } = confirmPasswordDto;

        if (before !== after) {
            throw new NotAcceptableException("The password you re-entered is not the same as the first one.");
        }

        if (await bcrypt.compare(after, user.password)) {
            const result: DeleteResult = await this.userRepository.delete({ id: user.id });

            if (result.affected === 0) {
                throw new InternalServerErrorException("Unknown Error.");
            }
        }
    }
}
