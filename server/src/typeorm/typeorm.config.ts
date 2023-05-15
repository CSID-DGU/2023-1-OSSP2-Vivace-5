import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeORMConfig: TypeOrmModuleOptions = {
    type: "postgres",
    host: "localhost",
    port: 55432,
    username: "postgres",
    password: "postgres",
    database: "tempo",
    entities: [__dirname + "/../**/*.entity.{ts,js}"],
    synchronize: true,
};
