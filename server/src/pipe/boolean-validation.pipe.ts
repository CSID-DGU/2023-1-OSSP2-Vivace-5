import { BadRequestException, Logger, PipeTransform } from "@nestjs/common";

export class BooleanValidationPipe implements PipeTransform {
    private logger = new Logger("BooleanValidationPipe");

    transform(value: any): boolean {
        this.logger.verbose(`The boolean value sent: ${value}`);

        value = value.toLowerCase();

        if (value === "true") {
            return true;
        } else if (value === "false") {
            return false;
        } else {
            throw new BadRequestException(`${value} is not boolean value.`);
        }
    }
}
