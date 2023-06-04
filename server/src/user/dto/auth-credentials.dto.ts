import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {
    @ApiProperty({
        example: 'gdhong@dongguk.edu',
        description: 'user email',
        required: true,
      })
    @IsString()
    @IsNotEmpty()
    @Matches(/[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]$/i, {
        message: "It isn't a format of e-mail address.",
    })
    email: string;

    @ApiProperty({
        example: "Qwas1234!",
        description: "Password",
        required: true,
    })
    @IsString()
    @MinLength(8, { message: "The password entered is too short." })
    @MaxLength(24, { message: "The password entered is too long." })
    @Matches(/^[A-Za-z0-9`~!@#\$%\^&\*\(\)_=\+-]*$/, {
        message: "password only accepts alphanumeric and some special character.(`~!@#$%^&*()-_=+)",
    })
    @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[`~!@#\$%\^&\*\(\)_=\+-]).*/, {
        message:
            "password should include at least one Upper case, one lower case, one numerical character, and one special character.(`~!@#$%^&*()_=+-)",
    })
    password: string;
}
