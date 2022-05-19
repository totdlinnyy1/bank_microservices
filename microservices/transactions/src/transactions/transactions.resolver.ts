import { Logger } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { TransactionObjectType } from './graphql/transaction.object-type'
import { TransactionsService } from './transactions.service'

@Resolver(() => TransactionObjectType)
export class TransactionsResolver {
    private readonly _logger: Logger = new Logger(TransactionsResolver.name)

    constructor(private readonly _transactionsService: TransactionsService) {}

    // Request to receive all wallet transactions
    @Query(() => [TransactionObjectType], {
        description: 'Query for get wallet transactions by wallet id',
    })
    async transactions(
        @Args('walletId', { type: () => String })
        walletId: string,
    ): Promise<TransactionObjectType[]> {
        this._logger.debug('GET WALLET TRANSACTIONS BY WALLET ID')
        this._logger.debug(walletId)
        return await this._transactionsService.transactions({ walletId })
    }

    // Request to receive one wallet transaction
    @Query(() => TransactionObjectType, {
        description: 'Query for get transaction by its id',
    })
    async transaction(
        @Args('id', { type: () => String }) id: string,
    ): Promise<TransactionObjectType> {
        this._logger.debug('GET WALLET TRANSACTION BY ID')
        this._logger.debug(id)
        return await this._transactionsService.transaction(id)
    }
}
