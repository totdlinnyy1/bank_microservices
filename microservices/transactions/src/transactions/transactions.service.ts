import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateTransactionDto } from './dtos/createTransaction.dto'
import { GetTransactionsDto } from './dtos/getTransactions.dto'
import { TransactionEntity } from './entities/transaction.entity'

@Injectable()
export class TransactionsService {
    private readonly _logger: Logger = new Logger(TransactionsService.name)

    constructor(
        @InjectRepository(TransactionEntity)
        private readonly _transactionsRepository: Repository<TransactionEntity>,
    ) {}

    // Function to receive all wallet transactions
    async transactions(data: GetTransactionsDto): Promise<TransactionEntity[]> {
        this._logger.debug('START GET TRANSACTIONS BY WALLET ID')
        this._logger.debug({ data })

        const trans = await this._transactionsRepository.find({
            where: [
                { toWalletId: data.walletId },
                { fromWalletId: data.walletId },
            ],
        })
        this._logger.debug({ trans })

        this._logger.debug('RETURN TRANSACTIONS')
        return trans
    }

    // Function to receive one wallet transaction
    async transaction(id: string): Promise<TransactionEntity> {
        this._logger.debug('START GET TRANSACTION BY WALLET ID')
        this._logger.debug(id)

        this._logger.debug('CHECK IF TRANSACTION EXIST')
        const candidate = await this._transactionsRepository.findOne({
            id,
        })
        this._logger.debug({ candidate })

        if (!candidate) {
            this._logger.debug('TRANSACTION DOES NOT EXIST')
            throw new NotFoundException(
                'This wallet or transaction does not exist.',
            )
        }

        this._logger.debug('RETURN TRANSACTION')
        return candidate
    }

    // Function save transaction to database
    async saveTransaction(
        data: CreateTransactionDto,
    ): Promise<TransactionEntity> {
        this._logger.debug('START SAVE TRANSACTION')
        this._logger.debug({ data })

        const transaction = await this._transactionsRepository.save(data)
        this._logger.debug({ transaction })

        this._logger.debug('RETURN TRANSACTION')
        return transaction
    }

    async deleteTransaction(id: string): Promise<boolean> {
        this._logger.debug('START DELETE TRANSACTION')
        this._logger.debug(id)

        await this.transaction(id)

        await this._transactionsRepository.delete(id)

        this._logger.debug('DELETE TRANSACTION SUCCESS')
        return true
    }
}
