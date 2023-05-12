"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const document = swagger_1.SwaggerModule.createDocument(app, new swagger_1.DocumentBuilder()
        .setTitle("Tempo API Docs")
        .setDescription("API document from Tempo, an easy-to-use project management tool.")
        .setVersion("1.0.0")
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        in: 'header',
    }, 'access-token')
        .build());
    swagger_1.SwaggerModule.setup("api-docs", app, document);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map