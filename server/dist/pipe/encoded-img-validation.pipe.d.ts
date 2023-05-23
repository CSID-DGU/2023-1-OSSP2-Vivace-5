import { PipeTransform } from "@nestjs/common";
export declare class EncodedImgValidationPipe implements PipeTransform {
    private logger;
    transform(value: any): any;
}
