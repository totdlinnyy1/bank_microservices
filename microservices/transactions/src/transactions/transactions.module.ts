import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TransactionEntity } from './entities/transaction.entity'
import { TransactionsController } from './transactions.controller'
import { TransactionsResolver } from './transactions.resolver'
import { TransactionsService } from './transactions.service'

@Module({
    imports: [TypeOrmModule.forFeature([TransactionEntity])],
    providers: [TransactionsService, TransactionsResolver],
    controllers: [TransactionsController],
})
export class TransactionsModule {}
