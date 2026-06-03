import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser())
  app.enableCors({
    origin: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
      .split(',')
      .map(o => o.trim()),
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  })
  const port = process.env.PORT || 4001
  await app.listen(port)
  console.log(`Auth service listening on http://localhost:${port}`)
}

bootstrap()
