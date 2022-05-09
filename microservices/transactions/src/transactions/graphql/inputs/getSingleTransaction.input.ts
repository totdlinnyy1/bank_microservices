import { Field, InputType } from '@nestjs/graphql'

@InputType({ description: 'Input for get single transaction' })
export class GetSingleTransactionInput {
    @Field(() => String, { description: 'Wallet Id' })
    readonly toWalletId: string
    @Field(() => String, { description: 'Transaction Id' })
    readonly transactionId: string
}
