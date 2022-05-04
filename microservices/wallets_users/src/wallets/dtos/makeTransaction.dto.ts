export class MakeTransactionDto {
    readonly toWalletId: string
    readonly fromWalletId: string
    readonly money: number
}
