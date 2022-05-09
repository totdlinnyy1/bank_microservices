import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

import { CreateTransactionDto } from './dtos/createTransaction.dto'
import { GetTransactionsDto } from './dtos/getTransactions.dto'
import { TransactionEntity } from './entities/transaction.entity'
import { TransactionsService } from './transactions.service'

@Controller('transactions')
export class TransactionsController {
    private readonly _logger: Logger = new Logger(TransactionsController.name)

    constructor(private readonly _transactionsService: TransactionsService) {}

    // Message pattern to create transactions
    @MessagePattern({ cmd: 'CREATE_TRANSACTION' })
    async createTransaction(
        @Payload() data: CreateTransactionDto,
    ): Promise<TransactionEntity> {
        this._logger.debug('GET TRANSACTION MESSAGE')
        this._logger.debug({ data })
        return await this._transactionsService.saveTransaction(data)
    }

    // Message pattern to get wallet transactions
    @MessagePattern({ cmd: 'GET_WALLET_TRANSACTIONS' })
    async getWalletTransactions(
        @Payload() data: GetTransactionsDto,
    ): Promise<TransactionEntity[]> {
        this._logger.debug('GET WALLET TRANSACTIONS MESSAGE')
        this._logger.debug({ data })
        return await this._transactionsService.transactions({
            walletId: data.walletId,
        })
    }
}
