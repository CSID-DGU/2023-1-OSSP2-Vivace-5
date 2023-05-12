"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotEmptyStringValidationPipe = void 0;
const common_1 = require("@nestjs/common");
class NotEmptyStringValidationPipe {
    constructor() {
        this.logger = new common_1.Logger("IsNotEmptyStringPipe");
    }
    transform(value) {
        this.logger.verbose(`The stirng value sent: ${value}`);
        if (typeof value === "string" && value.trim().length > 0) {
            return value;
        }
        else {
            throw new common_1.BadRequestException(`The value ${value} sent is empty or consist of only whitespace characters.`);
        }
    }
}
exports.NotEmptyStringValidationPipe = NotEmptyStringValidationPipe;
//# sourceMappingURL=not-empty-string-validation.pipe.js.map