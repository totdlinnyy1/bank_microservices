import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { timeout } from 'rxjs'
import { Connection, Repository } from 'typeorm'

import { isMoneyEnoughToWithdraw } from '../../helpers/isMoneyEnoughToWithdraw'
import { TransactionTypeEnum } from '../enums/transactionType.enum'
import { UserEntity } from '../users/entities/user.entity'

import { CreateTransactionDto } from './dtos/createTransaction.dto'
import { CreateWalletDto } from './dtos/createWallet.dto'
import { DepositOrWithdrawDto } from './dtos/depositOrWithdraw.dto'
import { GetTransactionsDto } from './dtos/getTransactions.dto'
import { LockWalletDto } from './dtos/lockWallet.dto'
import { MakeTransferDto } from './dtos/makeTransfer.dto'
import { WalletEntity } from './entities/wallet.entity'
import { TransactionObjectType } from './graphql/transaction.object-type'

const MICROSERVICE_TIMEOUT = 6000

@Injectable()
export class WalletsService {
    private readonly _logger: Logger = new Logger(WalletsService.name)

    constructor(
        @InjectRepository(WalletEntity)
        private readonly _walletsRepository: Repository<WalletEntity>,
        @InjectRepository(UserEntity)
        private readonly _userRepository: Repository<UserEntity>,
        private readonly _connection: Connection,
        @Inject('TRANSACTIONS_SERVICE') private readonly _client: ClientProxy,
    ) {}

    // The function creates a wallet
    async create(data: CreateWalletDto): Promise<WalletEntity> {
        this._logger.debug('START CREATE WALLET')
        this._logger.debug({ data })

        this._logger.debug('CHECK IF USER EXIST')
        const user = await this._userRepository.findOne({
            id: data.ownerId,
        })
        this._logger.debug({ user })

        // Checking for the existence of a user
        if (!user) {
            this._logger.debug('USER DOES NOT EXIST')
            throw new NotFoundException('This user does not exist')
        }

        this._logger.debug('CREATE WALLET')
        const wallet = await this._walletsRepository.save({
            ownerId: data.ownerId,
        })
        this._logger.debug({ wallet })

        this._logger.debug('RETURN WALLET')
        return await this.wallet(wallet.id)
    }

    // The function will get all wallets
    async wallets(): Promise<WalletEntity[]> {
        this._logger.debug('START GET WALLETS')
        const wallets = await this._walletsRepository.find({
            where: { isClosed: false, isLock: false },
        })
        this._logger.debug({ wallets })

        this._logger.debug('RETURN WALLETS')
        return wallets
    }

    // The function will get the wallets by its owner id
    async walletsByOwnerId(ownerId: string): Promise<WalletEntity[]> {
        this._logger.debug('START GET WALLETS BY OWNER ID')
        const wallets = await this._walletsRepository.find({
            where: { ownerId, isClosed: false, isLock: false },
        })
        this._logger.debug({ wallets })

        this._logger.debug('RETURN WALLETS')
        return wallets
    }

    // Function will get the transactions by wallet id
    async transactionsByWalletId(
        walletId: string,
    ): Promise<TransactionObjectType[]> {
        this._logger.debug('START GET TRANSACTIONS BY WALLET ID')
        const transactions = await this._client
            .send<TransactionObjectType[], GetTransactionsDto>(
                { cmd: 'GET_WALLET_TRANSACTIONS' },
                { walletId },
            )
            .toPromise()
        this._logger.debug('RETURN TRANSACTIONS')

        // Check if transactions exist
        if (!transactions) {
            return []
        }

        this._logger.debug({ transactions })
        return transactions
    }

    // The function will get the wallet by its id
    async wallet(id: string): Promise<WalletEntity> {
        this._logger.debug('START GET WALLET BY ID')
        this._logger.debug(id)

        this._logger.debug('CHECK IF WALLET EXIST')
        const candidate = await this._walletsRepository.findOne({
            where: {
                id,
                isClosed: false,
                isLock: false,
            },
        })

        // Checking for the existence of a wallet
        if (!candidate) {
            this._logger.debug('WALLET DOES NOT EXIST')
            throw new NotFoundException(
                'This wallet does not exist or is closed',
            )
        }
        this._logger.debug({ candidate })

        this._logger.debug('RETURN WALLET')
        return candidate
    }

    // The function closes the wallet by its id
    async close(id: string): Promise<string> {
        this._logger.debug('START CLOSE WALLET')
        this._logger.debug(id)

        await this.wallet(id)

        this._logger.debug('CLOSE WALLET')
        await this._walletsRepository.update({ id }, { isClosed: true })

        this._logger.debug('RETURN RESULT')
        return 'The wallet is closed'
    }

    // The function locks wallets
    async lock(data: LockWalletDto): Promise<boolean> {
        this._logger.debug('START LOCK WALLETS')
        this._logger.debug({ data })

        this._logger.debug('GET WALLETS')
        const wallets = await this._walletsRepository.find({
            ownerId: data.ownerId,
            isClosed: false,
            isLock: false,
        })

        if (!wallets.length) {
            this._logger.debug('WALLETS NOT FOUND')
            this._logger.debug('RETURN RESULT')
            return false
        }

        this._logger.debug('LOCK WALLETS')
        await this._walletsRepository.update(
            { ownerId: data.ownerId, isClosed: false, isLock: false },
            { isLock: true },
        )

        this._logger.debug('RETURN RESULT')
        return true
    }

    // The function puts money in the wallet
    async deposit(data: DepositOrWithdrawDto): Promise<TransactionObjectType> {
        this._logger.debug('START DEPOSIT')
        this._logger.debug({ data })

        this._logger.debug('START TRANSACTION')
        const queryRunner = this._connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction('SERIALIZABLE')

        try {
            this._logger.debug('CHECK IF WALLET EXIST')
            const wallet = await queryRunner.manager.findOne(WalletEntity, {
                id: data.id,
                isClosed: false,
                isLock: false,
            })
            this._logger.debug({ wallet })

            // Checking for the existence of a wallet
            if (!wallet) {
                this._logger.debug('WALLET DOES NOT EXIST')
                throw new NotFoundException(
                    'The wallet does not exist or is closed',
                )
            }

            this._logger.debug('DEPOSIT MONEY')
            await queryRunner.manager.update(
                WalletEntity,
                { id: data.id },
                { incoming: () => `incoming + ${data.money}` },
            )

            this._logger.debug('END DATABASE TRANSACTION')
            await queryRunner.commitTransaction()
        } catch (err) {
            this._logger.debug('AN ERROR HAS OCCURRED')
            this._logger.debug({ err })

            await queryRunner.rollbackTransaction()
            throw err
        } finally {
            await queryRunner.release()
        }

        try {
            this._logger.debug('RETURN TRANSACTION')
            const transaction = await this._client
                .send<TransactionObjectType, CreateTransactionDto>(
                    { cmd: 'CREATE_TRANSACTION' },
                    {
                        money: data.money,
                        toWalletId: data.id,
                        type: TransactionTypeEnum.DEPOSIT,
                    },
                )
                .pipe(timeout(MICROSERVICE_TIMEOUT))
                .toPromise()
            this._logger.debug({ transaction })

            if (!transaction) {
                throw new InternalServerErrorException(
                    'Error creating transaction',
                )
            }

            return transaction
        } catch (err) {
            this._logger.debug('ERROR WHILE TRANSACTION CREATE')
            this._logger.debug({ err })
            throw new InternalServerErrorException(
                'Error while transaction create',
            )
        }
    }

    // The function withdraws money from the wallet
    async withdraw(data: DepositOrWithdrawDto): Promise<TransactionObjectType> {
        this._logger.debug('START WITHDRAW')
        this._logger.debug({ data })

        this._logger.debug('START DATABASE TRANSACTION')
        const queryRunner = this._connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction('SERIALIZABLE')

        try {
            this._logger.debug('CHECK IF WALLET EXIST')
            const wallet = await queryRunner.manager.findOne(WalletEntity, {
                id: data.id,
                isClosed: false,
                isLock: false,
            })

            // Checking for the existence of a wallet
            if (!wallet) {
                this._logger.debug('WALLET DOES NOT EXIST')
                throw new NotFoundException(
                    'The wallet does not exist or is closed',
                )
            }

            this._logger.debug('CHECK IF MONEY ENOUGH TO WITHDRAW')
            // Checking if there is enough money on the balance
            if (
                !isMoneyEnoughToWithdraw({
                    walletBalance: wallet.actualBalance,
                    withdrawMoney: data.money,
                })
            ) {
                this._logger.debug('MONEY IS NOT ENOUGH TO WITHDRAW')
                throw new BadRequestException('Insufficient funds to withdraw')
            }

            this._logger.debug('WITHDRAW MONEY')
            await queryRunner.manager.update(
                WalletEntity,
                { id: data.id },
                { outgoing: () => `outgoing + ${data.money}` },
            )

            this._logger.debug('END DATABASE TRANSACTION')
            await queryRunner.commitTransaction()
        } catch (err) {
            this._logger.debug('AN ERROR HAS OCCURRED')
            this._logger.debug({ err })

            await queryRunner.rollbackTransaction()
            throw err
        } finally {
            await queryRunner.release()
        }

        try {
            this._logger.debug('RETURN TRANSACTION')
            const transaction = await this._client
                .send<TransactionObjectType, CreateTransactionDto>(
                    { cmd: 'CREATE_TRANSACTION' },
                    {
                        money: data.money,
                        toWalletId: data.id,
                        type: TransactionTypeEnum.WITHDRAW,
                    },
                )
                .pipe(timeout(MICROSERVICE_TIMEOUT))
                .toPromise()
            this._logger.debug({ transaction })

            if (!transaction) {
                throw new InternalServerErrorException(
                    'Error creating transaction',
                )
            }

            return transaction
        } catch (err) {
            this._logger.debug('ERROR WHILE TRANSACTION CREATE')
            this._logger.debug({ err })
            throw new InternalServerErrorException(
                'Error while transaction create',
            )
        }
    }

    // The function of creating a transaction between wallets
    async transfer(data: MakeTransferDto): Promise<TransactionObjectType> {
        this._logger.debug('START TRANSACTION')
        this._logger.debug({ data })

        this._logger.debug('SELF-TRANSACTION CHECK')
        // Self-translation check
        if (data.fromWalletId === data.toWalletId) {
            this._logger.debug('SELF-TRANSACTION ERROR')
            throw new BadRequestException(
                'You cannot make a transaction to yourself',
            )
        }

        this._logger.debug('START DATABASE TRANSACTION')
        const queryRunner = this._connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction('SERIALIZABLE')

        try {
            this._logger.debug('CHECK IF FROM_WALLET EXIST')
            const fromWallet = await queryRunner.manager.findOne(WalletEntity, {
                id: data.fromWalletId,
                isClosed: false,
                isLock: false,
            })
            this._logger.debug({ fromWallet })

            this._logger.debug('CHECK IF TO_WALLET EXIST')
            const toWallet = await queryRunner.manager.findOne(WalletEntity, {
                id: data.toWalletId,
                isClosed: false,
                isLock: false,
            })
            this._logger.debug({ toWallet })

            // Checking for the existence of a wallet
            if (!fromWallet) {
                this._logger.debug('FROM_WALLET DOES NOT EXIST')
                throw new NotFoundException(
                    "The sender's wallet does not exist or is closed",
                )
            }

            // Checking for the existence of a wallet
            if (!toWallet) {
                this._logger.debug('TO_WALLET DOES NOT EXIST')
                throw new NotFoundException(
                    "The recipient's wallet does not exist or is closed",
                )
            }

            this._logger.debug(
                'CHECK IF MONEY ENOUGH TO WITHDRAW IN FROM_WALLET',
            )
            // Checking if there is enough money on the balance
            if (
                !isMoneyEnoughToWithdraw({
                    walletBalance: fromWallet.actualBalance,
                    withdrawMoney: data.money,
                })
            ) {
                this._logger.debug(
                    'MONEY IS NOT ENOUGH TO WITHDRAW IN FROM_WALLET',
                )
                throw new BadRequestException(
                    'Insufficient funds to transaction',
                )
            }

            this._logger.debug('WITHDRAWING MONEY IN FROM_WALLET')
            // Withdrawing money from the sender's wallet
            await queryRunner.manager.update(
                WalletEntity,
                { id: data.fromWalletId },
                { outgoing: () => `outgoing + ${data.money}` },
            )

            this._logger.debug('DEPOSIT MONEY IN TO_WALLET')
            // Deposit money to the receiving wallet
            await queryRunner.manager.update(
                WalletEntity,
                { id: data.toWalletId },
                { incoming: () => `incoming + ${data.money}` },
            )

            this._logger.debug('END DATABASE TRANSACTION')
            await queryRunner.commitTransaction()
        } catch (err) {
            this._logger.debug('AN ERROR HAS OCCURRED')
            this._logger.debug({ err })

            await queryRunner.rollbackTransaction()
            throw err
        } finally {
            await queryRunner.release()
        }

        try {
            this._logger.debug('RETURN TRANSACTION')
            const transaction = await this._client
                .send<TransactionObjectType, CreateTransactionDto>(
                    { cmd: 'CREATE_TRANSACTION' },
                    {
                        money: data.money,
                        toWalletId: data.toWalletId,
                        fromWalletId: data.fromWalletId,
                        type: TransactionTypeEnum.TRANSFER,
                    },
                )
                .pipe(timeout(MICROSERVICE_TIMEOUT))
                .toPromise()
            this._logger.debug({ transaction })

            if (!transaction) {
                throw new InternalServerErrorException(
                    'Error creating transaction',
                )
            }

            return transaction
        } catch (err) {
            this._logger.debug('ERROR WHILE TRANSACTION CREATE')
            this._logger.debug({ err })
            throw new InternalServerErrorException(
                'Error while transaction create',
            )
        }
    }
}
