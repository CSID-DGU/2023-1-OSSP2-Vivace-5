import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

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
