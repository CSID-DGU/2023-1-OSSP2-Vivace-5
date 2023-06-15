import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class UpdateDocTitleDto {
    @IsUUID()
    docId: string;

    @IsString()
    @IsNotEmpty()
    newTitle: string;
}
