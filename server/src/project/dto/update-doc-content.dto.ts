import { IsString, IsUUID } from "class-validator";

export class UpdateDocContentDto {
    @IsUUID()
    docId: string;

    @IsString()
    newContent: string;
}
