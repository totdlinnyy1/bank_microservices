import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { WalletsModule } from '../wallets/wallets.module'

import { UserEntity } from './entities/user.entity'
import { UsersResolver } from './users.resolver'
import { UsersService } from './users.service'

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), WalletsModule],
    providers: [UsersService, UsersResolver],
})
export class UsersModule {}
