import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class ConfirmPasswordDto {
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
    before: string;

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
    after: string;
}
