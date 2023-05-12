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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_repository_1 = require("./user.repository");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
let UserService = class UserService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async signUp(signUpDto) {
        return this.userRepository.createUser(signUpDto);
    }
    async signIn(authCredentialsDto) {
        const { email, password } = authCredentialsDto;
        const user = await this.userRepository.findOneBy({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const payload = { email };
            const accessToken = this.jwtService.sign(payload);
            return { accessToken };
        }
        else {
            throw new common_1.UnauthorizedException("Login failed");
        }
    }
    async getUserEntity(id) {
        return this.userRepository.findOneBy({ id });
    }
    async saveUserEntity(user) {
        await this.userRepository.save(user);
    }
    extractPublicInfo(user) {
        const userInfo = {
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
    async getUserInfo(id) {
        const user = await this.getUserEntity(id);
        if (!user) {
            throw new common_1.NotFoundException(`User ${id} is not found.`);
        }
        return this.extractPublicInfo(user);
    }
    async updateUser(user, updateUserDto) {
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
    async updatePassword(user, updatePasswordDto) {
        const { before, after } = updatePasswordDto;
        if (before === after) {
            throw new common_1.NotAcceptableException("The password you want to change is the same as before.");
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(after, salt);
        user.password = hashedPassword;
        await this.userRepository.save(user);
    }
    async withdraw(user, confirmPasswordDto) {
        const { password } = confirmPasswordDto;
        if (await bcrypt.compare(password, user.password)) {
            const result = await this.userRepository.delete({ id: user.id });
            if (result.affected === 0) {
                throw new common_1.InternalServerErrorException("Unknown Error.");
            }
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_repository_1.UserRepository)),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        jwt_1.JwtService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map