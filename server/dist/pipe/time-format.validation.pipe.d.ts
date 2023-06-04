import { PipeTransform } from "@nestjs/common";
export declare class TimeFormatValidationPipe implements PipeTransform {
    private logger;
    transform(value: string): Date;
}
