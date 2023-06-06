import { BadRequestException, Logger, PipeTransform } from "@nestjs/common";

export class EncodedImgValidationPipe implements PipeTransform {
    private logger = new Logger("EncodedImgValidationPipe");

    transform(value: any) {
        const encodedImg: string = value.encodedImg;

        if (!encodedImg) {
            return value;
        }

        const base64ImgRegex = /^data:image\/(png|jpeg|gif);base64,(.*)$/;
        const result: RegExpMatchArray = encodedImg.match(base64ImgRegex);

        if (!result) {
            throw new BadRequestException(`The encodedImg sent is not in the format .png, .jpeg, or .gif.`);
        }

        const data = result[2];
        const sizeInByte = (data.length * 3) / 4 - (data.indexOf("=") > 0 ? data.length - data.indexOf("=") : 0);

        this.logger.verbose(`The encodedImg sent: size ${sizeInByte} byte, extension: ${result[1]}.`);

        if (sizeInByte > 1024 * 1024 * 10) {
            throw new BadRequestException(
                `The encodedImg transferred is too large. (size: ${sizeInByte} byte) This service only allows profile pictures up to 10MB.`,
            );
        }

        return value;
    }
}
