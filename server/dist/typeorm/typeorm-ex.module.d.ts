import { DynamicModule } from "@nestjs/common";
export declare class TypeOrmExModule {
    static forCustomRepository<T extends new (...args: any[]) => any>(repositories: T[]): DynamicModule;
}
