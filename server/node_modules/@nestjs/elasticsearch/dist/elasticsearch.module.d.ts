import { DynamicModule } from '@nestjs/common';
import { ElasticsearchModuleAsyncOptions, ElasticsearchModuleOptions } from './interfaces/elasticsearch-module-options.interface';
export declare class ElasticsearchModule {
    static register(options: ElasticsearchModuleOptions): DynamicModule;
    static registerAsync(options: ElasticsearchModuleAsyncOptions): DynamicModule;
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
}
