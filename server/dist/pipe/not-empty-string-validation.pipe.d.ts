import { PipeTransform } from "@nestjs/common";
export declare class NotEmptyStringValidationPipe implements PipeTransform {
    private logger;
    transform(value: any): string;
}
