import { PipeTransform } from "@nestjs/common";
export declare class BooleanValidationPipe implements PipeTransform {
    private logger;
    transform(value: any): boolean;
}
