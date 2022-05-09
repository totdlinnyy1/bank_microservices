import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm'

import { rabbitmqClientConfig } from '../config/rabbitmq-client.config'
import { UserEntity } from '../users/entities/user.entity'

import { WalletEntity } from './entities/wallet.entity'
import { WalletsResolver } from './wallets.resolver'
import { WalletsService } from './wallets.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([WalletEntity, UserEntity]),
        ClientsModule.register([rabbitmqClientConfig]),
    ],
    providers: [WalletsService, WalletsResolver],
    exports: [WalletsService],
})
export class WalletsModule {}
