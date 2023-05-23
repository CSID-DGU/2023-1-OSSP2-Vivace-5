"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUIDValidationPipe = void 0;
const common_1 = require("@nestjs/common");
class UUIDValidationPipe {
    constructor() {
        this.logger = new common_1.Logger("UUIDValidationPipe");
        this.uuidRegex = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
    }
    transform(value) {
        this.logger.verbose(`The UUID value sent: ${value}`);
        if (!this.uuidRegex.test(value)) {
            throw new common_1.BadRequestException(`${value} is not UUID form.`);
        }
        return value;
    }
}
exports.UUIDValidationPipe = UUIDValidationPipe;
//# sourceMappingURL=uuid-validation.pipe.js.map