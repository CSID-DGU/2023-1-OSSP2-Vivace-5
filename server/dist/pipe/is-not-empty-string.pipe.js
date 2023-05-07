"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsNotEmptyStringPipe = void 0;
const common_1 = require("@nestjs/common");
class IsNotEmptyStringPipe {
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
exports.IsNotEmptyStringPipe = IsNotEmptyStringPipe;
//# sourceMappingURL=is-not-empty-string.pipe.js.map