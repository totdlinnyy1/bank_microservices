import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserEntity } from '../users/entities/user.entity'

import { WalletEntity } from './entities/wallet.entity'
import { WalletsResolver } from './wallets.resolver'
import { WalletsService } from './wallets.service'

@Module({
    imports: [TypeOrmModule.forFeature([WalletEntity, UserEntity])],
    providers: [WalletsService, WalletsResolver],
    exports: [WalletsService],
})
export class WalletsModule {}
