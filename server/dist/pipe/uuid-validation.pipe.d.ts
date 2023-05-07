import { PipeTransform } from "@nestjs/common";
export declare class UUIDValidationPipe implements PipeTransform {
    private logger;
    readonly uuidRegex: RegExp;
    transform(value: any): any;
}
