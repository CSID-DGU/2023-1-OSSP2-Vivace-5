import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class ConfirmPasswordDto {
    @ApiProperty({
        example: "Erdf5678@",
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
