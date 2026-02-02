import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite dev
      'http://localhost:4173', // Vite preview
      'https://lampistas.vercel.app', // Vercel production
      'https://*.vercel.app', // Cualquier preview de Vercelu
    ],
    credentials: true,
  });

  app.use('/payments/webhook', bodyParser.raw({ type: 'application/json' }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
