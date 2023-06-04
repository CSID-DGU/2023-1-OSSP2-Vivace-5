import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({
        example: "Cheolsu",
        description: "First name",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        example: "Kim",
        description: "Last name",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        example: 1998,
        description: "Year of birth",
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => Number.parseInt(value))
    year: number;

    @ApiProperty({
        example: 2,
        description: "Month of birth",
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => Number.parseInt(value))
    month: number;

    @ApiProperty({
        example: 14,
        description: "Day of birth",
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => Number.parseInt(value))
    date: number;

    @ApiProperty({
        example: "동국대학교",
        description: "소속",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    belong: string;

    @ApiProperty({
        example: "Republic of Korea",
        description: "Country",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    country: string;

    @ApiProperty({
        example: "Seoul",
        description: "Region",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    region: string;

    @ApiProperty({
        example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAT1JREFUeNrsV0kKwjAQxNeD13tRd7VjICJKSiZpOUVZiMtbjKqB3MhBxjo2VnYWFB0YAl1YZdj4JZKjQRBQ0FAUcR8kS5jxue5m5z5/44vY8e6WZ/6BZj/HPgAlVIkQXoWxUHLYMmkjKUkY6UJW6jo+xlZfKys6uxqvvevX2J6scop+6phbBWWzgVRJ3q4LzJZ/KQ2Z+JWMRnXbS9xTR5GpwAAAABJRU5ErkJggg==",
        description: "Image",
        required: true,
    })
    @IsString()
    encodedImg: string;
}
