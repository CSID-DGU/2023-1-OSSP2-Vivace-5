import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "./user.repository";
import { User } from "../entity/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository) {
        super({
            secretOrKey:
                "F11B9C3B3E35999339B3E3A8CE362B6E309F08193B18D5FFD22991BBDBA2FAC18531BEDD358AD44951A98A87695A67C39E8C954F87A16C91B90BAB1EB26F409E",
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload): Promise<User> {
        const { email } = payload;
        const user: User = await this.userRepository.findOneBy({ email });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
