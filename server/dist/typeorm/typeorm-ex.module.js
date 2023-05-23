"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmExModule = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_ex_decorator_1 = require("./typeorm-ex.decorator");
class TypeOrmExModule {
    static forCustomRepository(repositories) {
        const providers = [];
        for (const repository of repositories) {
            const entity = Reflect.getMetadata(typeorm_ex_decorator_1.TYPEORM_EX_CUSTOM_REPOSITORY, repository);
            if (!entity) {
                continue;
            }
            providers.push({
                inject: [(0, typeorm_1.getDataSourceToken)()],
                provide: repository,
                useFactory: (dataSource) => {
                    const baseRepository = dataSource.getRepository(entity);
                    return new repository(baseRepository.target, baseRepository.manager, baseRepository.queryRunner);
                },
            });
        }
        return {
            exports: providers,
            module: TypeOrmExModule,
            providers,
        };
    }
}
exports.TypeOrmExModule = TypeOrmExModule;
//# sourceMappingURL=typeorm-ex.module.js.map