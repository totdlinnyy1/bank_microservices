import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'

import { AppModule } from './app.module'

const logger = new Logger('AppBootstrap')

const DEFAULT_APP_HORT = 'localhost'
const DEFAULT_APP_PORT = 3000

const DEFAULT_RABBITMQ_URL = 'amqp://localhost:5672'
const DEFAULT_RABBITMQ_QUEUE = 'bank-queue'

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule)

    const configService = app.get(ConfigService)

    const port = configService.get('PORT') || DEFAULT_APP_PORT
    const hostname = configService.get('HOST') || DEFAULT_APP_HORT

    const rabbitmqUrl =
        configService.get('RABBITMQ_URL') || DEFAULT_RABBITMQ_URL
    const rabbitmqQueue =
        configService.get('RABBITMQ_QUEUE') || DEFAULT_RABBITMQ_QUEUE

    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: [rabbitmqUrl],
            queue: rabbitmqQueue,
        },
    })

    await app.startAllMicroservices()
    await app.listen(port, hostname, () =>
        logger.log(`Server running at ${hostname}:${port}`),
    )
}
bootstrap()
