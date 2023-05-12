import { BadRequestException, Logger, PipeTransform } from "@nestjs/common";

export class NotEmptyStringValidationPipe implements PipeTransform {
    private logger = new Logger("IsNotEmptyStringPipe");

    transform(value: any) {
        this.logger.verbose(`The stirng value sent: ${value}`);

        if (typeof value === "string" && value.trim().length > 0) {
            return value;
        } else {
            throw new BadRequestException(`The value ${value} sent is empty or consist of only whitespace characters.`);
        }
    }
}
