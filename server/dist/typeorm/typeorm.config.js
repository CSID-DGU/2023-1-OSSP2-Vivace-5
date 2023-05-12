"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeORMConfig = void 0;
exports.typeORMConfig = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "tempo",
    entities: [__dirname + "/../**/*.entity.{ts,js}"],
    synchronize: true,
};
//# sourceMappingURL=typeorm.config.js.map