import { BadRequestException, Logger, PipeTransform } from "@nestjs/common";

export class TimeFormatValidationPipe implements PipeTransform {
    private logger = new Logger("IsUTCTimeFormat");

    transform(value: string): Date {
        this.logger.verbose(`time ${value} is sent!`);

        const date = new Date(value);

        if (!isNaN(date.getTime())) {
            return date;
        }

        throw new BadRequestException(`${value} is not a time format.`);
    }
}
