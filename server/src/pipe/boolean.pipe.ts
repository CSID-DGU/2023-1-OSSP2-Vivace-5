import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class BooleanPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const { metatype } = metadata;

        if (metatype === Boolean) {
            return value;
        }

        if (metatype === String) {
            value = (value as string).toLowerCase().trim();

            if (value === "true") {
                return true;
            }

            if (value === "false") {
                return false;
            }
        }

        throw new BadRequestException(
            `Value ${value} is not boolean like value. (boolean and boolean string is only allowed)`,
        );
    }
}
