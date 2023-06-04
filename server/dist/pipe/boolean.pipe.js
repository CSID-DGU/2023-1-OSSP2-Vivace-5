"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanPipe = void 0;
const common_1 = require("@nestjs/common");
class BooleanPipe {
    transform(value, metadata) {
        const { metatype } = metadata;
        if (metatype === Boolean) {
            return value;
        }
        if (metatype === String) {
            value = value.toLowerCase().trim();
            if (value === "true") {
                return true;
            }
            if (value === "false") {
                return false;
            }
        }
        throw new common_1.BadRequestException(`Value ${value} is not boolean like value. (boolean and boolean string is only allowed)`);
    }
}
exports.BooleanPipe = BooleanPipe;
//# sourceMappingURL=boolean.pipe.js.map