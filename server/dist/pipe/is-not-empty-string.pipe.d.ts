import { PipeTransform } from "@nestjs/common";
export declare class IsNotEmptyStringPipe implements PipeTransform {
    private logger;
    transform(value: any): string;
}
