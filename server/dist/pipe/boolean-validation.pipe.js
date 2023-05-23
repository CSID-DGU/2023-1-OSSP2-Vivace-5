"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanValidationPipe = void 0;
const common_1 = require("@nestjs/common");
class BooleanValidationPipe {
    constructor() {
        this.logger = new common_1.Logger("BooleanValidationPipe");
    }
    transform(value) {
        this.logger.verbose(`The boolean value sent: ${value}`);
        value = value.toLowerCase();
        if (value === "true") {
            return true;
        }
        else if (value === "false") {
            return false;
        }
        else {
            throw new common_1.BadRequestException(`${value} is not boolean value.`);
        }
    }
}
exports.BooleanValidationPipe = BooleanValidationPipe;
//# sourceMappingURL=boolean-validation.pipe.js.map