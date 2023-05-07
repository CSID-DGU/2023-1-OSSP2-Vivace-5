import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmExModule } from "src/typeorm/typeorm-ex.module";
import { UserRepository } from "./user.repository";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";

@Module({
    imports: [
        TypeOrmExModule.forCustomRepository([UserRepository]),
        PassportModule.register({ defaultStrategy: "jwt" }),
        JwtModule.register({
            secret: "F11B9C3B3E35999339B3E3A8CE362B6E309F08193B18D5FFD22991BBDBA2FAC18531BEDD358AD44951A98A87695A67C39E8C954F87A16C91B90BAB1EB26F409E",
            signOptions: { expiresIn: 60 * 60 },
        }),
    ],
    controllers: [UserController],
    providers: [UserService, JwtStrategy],
    exports: [JwtStrategy, PassportModule, UserService],
})
export class UserModule {}
