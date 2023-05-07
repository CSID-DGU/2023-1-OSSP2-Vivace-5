import { BadRequestException, Logger, PipeTransform } from "@nestjs/common";

export class UUIDValidationPipe implements PipeTransform {
    private logger = new Logger("UUIDValidationPipe");

    readonly uuidRegex: RegExp = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;

    transform(value: any) {
        this.logger.verbose(`The UUID value sent: ${value}`);

        if (!this.uuidRegex.test(value)) {
            throw new BadRequestException(`${value} is not UUID form.`);
        }

        return value;
    }
}
