import { TransactionTypeEnum } from '../../enums/transactionType.enum'

export class CreateTransactionDto {
    readonly type: TransactionTypeEnum
    readonly money: number
    readonly toWalletId: string
    readonly fromWalletId?: string
}
