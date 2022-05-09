import { ClientProviderOptions, Transport } from '@nestjs/microservices'

export const rabbitmqClientConfig: ClientProviderOptions = {
    name: 'TRANSACTIONS_SERVICE',
    transport: Transport.RMQ,
    options: {
        urls: ['amqp://admin:admin@localhost:5672'],
        queue: 'bank-queue',
    },
}
