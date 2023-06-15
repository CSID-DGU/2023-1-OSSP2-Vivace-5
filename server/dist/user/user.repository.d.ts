import { Repository } from "typeorm";
import { User } from "../entity/user.entity";
import { SignUpDto } from "./dto/sign-up.dto";
export declare class UserRepository extends Repository<User> {
    createUser(signUpDto: SignUpDto): Promise<void>;
}
