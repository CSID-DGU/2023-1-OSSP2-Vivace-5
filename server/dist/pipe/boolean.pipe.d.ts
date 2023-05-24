import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
export declare class BooleanPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
