"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncodedImgValidationPipe = void 0;
const common_1 = require("@nestjs/common");
class EncodedImgValidationPipe {
    constructor() {
        this.logger = new common_1.Logger("EncodedImgValidationPipe");
    }
    transform(value) {
        const encodedImg = value.encodedImg;
        const base64ImgRegex = /^data:image\/(png|jpeg|gif);base64,(.*)$/;
        const result = encodedImg.match(base64ImgRegex);
        if (!result) {
            throw new common_1.BadRequestException(`The encodedImg sent is not in the format .png, .jpeg, or .gif.`);
        }
        const data = result[2];
        const sizeInByte = (data.length * 3) / 4 - (data.indexOf("=") > 0 ? data.length - data.indexOf("=") : 0);
        this.logger.verbose(`The encodedImg sent: size ${sizeInByte} byte, extension: ${result[1]}.`);
        if (sizeInByte > 1024 * 1024 * 10) {
            throw new common_1.BadRequestException(`The encodedImg transferred is too large. (size: ${sizeInByte} byte) This service only allows profile pictures up to 10MB.`);
        }
        return value;
    }
}
exports.EncodedImgValidationPipe = EncodedImgValidationPipe;
//# sourceMappingURL=encoded-img-validation.pipe.js.map