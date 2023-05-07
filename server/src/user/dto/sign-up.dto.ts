import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]$/i, {
        message: "It isn't a format of e-mail address.",
    })
    email: string;

    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => Number.parseInt(value))
    year: number;

    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => Number.parseInt(value))
    month: number;

    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => Number.parseInt(value))
    date: number;

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

    @IsString()
    @IsNotEmpty()
    belong: string;

    @IsString()
    @IsNotEmpty()
    country: string;

    @IsString()
    @IsNotEmpty()
    region: string;

    @IsString()
    encodedImg: string;
}
