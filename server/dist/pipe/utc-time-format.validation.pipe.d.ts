import { PipeTransform } from "@nestjs/common";
export declare class UTCTimeFormatValidationPipe implements PipeTransform {
    private logger;
    transform(value: any): Date;
}
