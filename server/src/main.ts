import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    app.enableCors({
        origin: "http://localhost:3000",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });

    const document = SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
            .setTitle("Tempo API Docs")
            .setDescription("API document from Tempo, an easy-to-use project management tool.")
            .setVersion("1.0.0")
            .addBearerAuth(
                {
                    type: "http",
                    scheme: "bearer",
                    name: "JWT",
                    in: "header",
                },
                "access-token",
            )
            .build(),
    );

    SwaggerModule.setup("api-docs", app, document);

    await app.listen(4000);
}
bootstrap();
