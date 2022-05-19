import { Logger, UsePipes, ValidationPipe } from '@nestjs/common'
import {
    Args,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql'

import { CreateWalletInputType } from './graphql/inputs/createWallet.input-type'
import { DepositOrWithdrawInputType } from './graphql/inputs/depositOrWithdraw.input-type'
import { MakeTransferInputType } from './graphql/inputs/makeTransfer.input-type'
import { TransactionObjectType } from './graphql/transaction.object-type'
import { WalletObjectType } from './graphql/wallet.object-type'
import { WalletsService } from './wallets.service'

@Resolver(() => WalletObjectType)
export class WalletsResolver {
    private readonly _logger: Logger = new Logger(WalletsResolver.name)

    constructor(private readonly _walletsService: WalletsService) {}

    // Request to receive all wallets
    @Query(() => [WalletObjectType], { description: 'Query for get wallets' })
    async wallets(): Promise<WalletObjectType[]> {
        this._logger.debug('GET WALLETS')
        return await this._walletsService.wallets()
    }

    // Request for a wallet by id
    @Query(() => WalletObjectType, {
        description: 'Query for get wallet by id',
    })
    async wallet(
        @Args('id', { type: () => String })
        id: string,
    ): Promise<WalletObjectType> {
        this._logger.debug('GET WALLET BY ID')
        this._logger.debug(id)
        return await this._walletsService.wallet(id)
    }

    // Resolve wallet transactions
    @ResolveField(() => [TransactionObjectType], {
        description: 'Get wallet transactions',
    })
    async transactions(
        @Parent() wallet: WalletObjectType,
    ): Promise<TransactionObjectType[]> {
        this._logger.debug('GET WALLET TRANSACTIONS BY WALLET ID')
        this._logger.debug(wallet.id)
        return await this._walletsService.transactionsByWalletId(wallet.id)
    }

    // Mutation to create a wallet
    @Mutation(() => WalletObjectType, {
        description: 'Mutation for create wallet',
    })
    async createWallet(
        @Args('input', { type: () => CreateWalletInputType })
        input: CreateWalletInputType,
    ): Promise<WalletObjectType> {
        this._logger.debug('CREATE WALLET')
        this._logger.debug({ input })
        return await this._walletsService.create(input)
    }

    // Mutation to close the wallet by ID
    @Mutation(() => String, { description: 'Mutation for close wallet' })
    async close(
        @Args('id', { type: () => String })
        id: string,
    ): Promise<string> {
        this._logger.debug('CLOSE WALLET')
        this._logger.debug(id)
        return await this._walletsService.close(id)
    }

    // Deposit Mutation
    @Mutation(() => TransactionObjectType, {
        description: 'Mutation for make deposit',
    })
    @UsePipes(new ValidationPipe())
    async deposit(
        @Args('input', { type: () => DepositOrWithdrawInputType })
        input: DepositOrWithdrawInputType,
    ): Promise<TransactionObjectType> {
        this._logger.debug('MAKE DEPOSIT')
        this._logger.debug({ input })
        return await this._walletsService.deposit(input)
    }

    // Withdraw Mutation
    @Mutation(() => TransactionObjectType, {
        description: 'Mutation for make withdraw',
    })
    @UsePipes(new ValidationPipe())
    async withdraw(
        @Args('input', { type: () => DepositOrWithdrawInputType })
        input: DepositOrWithdrawInputType,
    ): Promise<TransactionObjectType> {
        this._logger.debug('MAKE WITHDRAW')
        this._logger.debug({ input })
        return await this._walletsService.withdraw(input)
    }

    // Mutation to transfer money between wallets
    @Mutation(() => TransactionObjectType, {
        description: 'Mutation to transfer money from one wallet to another',
    })
    @UsePipes(new ValidationPipe())
    async transfer(
        @Args('input', { type: () => MakeTransferInputType })
        input: MakeTransferInputType,
    ): Promise<TransactionObjectType> {
        this._logger.debug('MAKE TRANSACTION')
        this._logger.debug({ input })
        return await this._walletsService.transfer(input)
    }
}
