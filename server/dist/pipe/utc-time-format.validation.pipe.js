"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UTCTimeFormatValidationPipe = void 0;
const common_1 = require("@nestjs/common");
class UTCTimeFormatValidationPipe {
    constructor() {
        this.logger = new common_1.Logger("IsUTCTimeFormat");
    }
    transform(value) {
        this.logger.verbose(`UTC time ${value} is sent!`);
        const date = new Date(value);
        if (!isNaN(date.getTime()) && value.endsWith("Z")) {
            return date;
        }
        throw new common_1.BadRequestException(`${value} is not UTC time format.`);
    }
}
exports.UTCTimeFormatValidationPipe = UTCTimeFormatValidationPipe;
//# sourceMappingURL=utc-time-format.validation.pipe.js.map