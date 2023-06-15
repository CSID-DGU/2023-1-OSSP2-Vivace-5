import { Repository } from "typeorm";
import { User } from "../entity/user.entity";
import { SignUpDto } from "./dto/sign-up.dto";
import * as bcrypt from "bcryptjs";
import { CustomRepository } from "src/typeorm/typeorm-ex.decorator";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { ProjectComment } from "src/entity/project-comment.entity";

@CustomRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(signUpDto: SignUpDto): Promise<void> {
        const { firstName, lastName, email, year, month, date, password, belong, country, region, encodedImg } =
            signUpDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user: User = new User();
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
        user.projectComments = [] as ProjectComment[];

        const now = new Date();
        user.createdAt = new Date(
            Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds(),
            ),
        );

        try {
            await this.save(user);
        } catch (error) {
            if (error.code === "23505") {
                throw new ConflictException("Existing email.");
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
}
