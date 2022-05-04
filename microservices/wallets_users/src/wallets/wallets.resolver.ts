import { Logger, UsePipes, ValidationPipe } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { CreateWalletInputType } from './graphql/inputs/createWallet.input-type'
import { DepositOrWithdrawInputType } from './graphql/inputs/depositOrWithdraw.input-type'
import { MakeTransactionInputType } from './graphql/inputs/makeTransaction.input-type'
import { WalletObjectType } from './graphql/wallet.object-type'
import { WalletsService } from './wallets.service'

@Resolver(() => WalletObjectType)
export class WalletsResolver {
    private readonly _logger: Logger = new Logger(WalletsResolver.name)

    constructor(private readonly _walletsService: WalletsService) {}

    // Request to receive all wallets
    @Query(() => [WalletObjectType])
    async wallets(): Promise<WalletObjectType[]> {
        this._logger.debug('GET WALLETS')
        return await this._walletsService.wallets()
    }

    // Request for a wallet by id
    @Query(() => WalletObjectType)
    async wallet(
        @Args('id', { type: () => String })
        id: string,
    ): Promise<WalletObjectType> {
        this._logger.debug('GET WALLET BY ID')
        return await this._walletsService.wallet(id)
    }

    // Mutation to create a wallet
    @Mutation(() => WalletObjectType)
    async createWallet(
        @Args('input', { type: () => CreateWalletInputType })
        input: CreateWalletInputType,
    ): Promise<WalletObjectType> {
        this._logger.debug('CREATE WALLET')
        this._logger.debug({ input })
        return await this._walletsService.create(input)
    }

    // Mutation to close the wallet by ID
    @Mutation(() => String)
    async close(
        @Args('id', { type: () => String })
        id: string,
    ): Promise<string> {
        this._logger.debug('CLOSE WALLET')
        this._logger.debug(id)
        return await this._walletsService.close(id)
    }

    // Deposit Mutation
    @Mutation(() => WalletObjectType)
    @UsePipes(new ValidationPipe())
    async deposit(
        @Args('input', { type: () => DepositOrWithdrawInputType })
        input: DepositOrWithdrawInputType,
    ): Promise<WalletObjectType> {
        this._logger.debug('MAKE DEPOSIT')
        this._logger.debug({ input })
        return await this._walletsService.deposit(input)
    }

    // Withdraw Mutation
    @Mutation(() => WalletObjectType)
    @UsePipes(new ValidationPipe())
    async withdraw(
        @Args('input', { type: () => DepositOrWithdrawInputType })
        input: DepositOrWithdrawInputType,
    ): Promise<WalletObjectType> {
        this._logger.debug('MAKE WITHDRAW')
        this._logger.debug({ input })
        return await this._walletsService.withdraw(input)
    }

    // Mutation to transfer money between wallets
    @Mutation(() => WalletObjectType)
    @UsePipes(new ValidationPipe())
    async createTransaction(
        @Args('input', { type: () => MakeTransactionInputType })
        input: MakeTransactionInputType,
    ): Promise<WalletObjectType> {
        this._logger.debug('MAKE TRANSACTION')
        this._logger.debug({ input })
        return await this._walletsService.transaction(input)
    }
}
