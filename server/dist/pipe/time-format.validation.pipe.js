"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeFormatValidationPipe = void 0;
const common_1 = require("@nestjs/common");
class TimeFormatValidationPipe {
    constructor() {
        this.logger = new common_1.Logger("IsUTCTimeFormat");
    }
    transform(value) {
        this.logger.verbose(`time ${value} is sent!`);
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return date;
        }
        throw new common_1.BadRequestException(`${value} is not a time format.`);
    }
}
exports.TimeFormatValidationPipe = TimeFormatValidationPipe;
//# sourceMappingURL=time-format.validation.pipe.js.map