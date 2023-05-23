"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entity/user.entity");
const bcrypt = require("bcryptjs");
const typeorm_ex_decorator_1 = require("../typeorm/typeorm-ex.decorator");
const common_1 = require("@nestjs/common");
let UserRepository = class UserRepository extends typeorm_1.Repository {
    async createUser(joinMembershipDto) {
        const { firstName, lastName, email, year, month, date, password, belong, country, region, encodedImg } = joinMembershipDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new user_entity_1.User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.year = year;
        user.month = month;
        user.date = date;
        user.password = hashedPassword;
        user.belong = belong;
        user.country = country;
        user.region = region;
        user.encodedImg = encodedImg;
        user.projectComments = [];
        const now = new Date();
        user.createdAt = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
        try {
            await this.save(user);
        }
        catch (error) {
            if (error.code === "23505") {
                throw new common_1.ConflictException("Existing email.");
            }
            else {
                throw new common_1.InternalServerErrorException();
            }
        }
    }
};
UserRepository = __decorate([
    (0, typeorm_ex_decorator_1.CustomRepository)(user_entity_1.User)
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map