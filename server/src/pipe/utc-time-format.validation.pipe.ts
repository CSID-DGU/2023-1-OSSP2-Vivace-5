import { BadRequestException, Logger, PipeTransform } from "@nestjs/common";

export class UTCTimeFormatValidationPipe implements PipeTransform {
    private logger = new Logger("IsUTCTimeFormat");

    transform(value: any): Date {
        this.logger.verbose(`UTC time ${value} is sent!`);

        const date = new Date(value);

        if (!isNaN(date.getTime()) && value.endsWith("Z")) {
            return date;
        }

        throw new BadRequestException(`${value} is not UTC time format.`);
    }
}
