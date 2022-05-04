import { Field, Float, InputType } from '@nestjs/graphql'
import { IsPositive } from 'class-validator'

@InputType({ description: 'Input for make transfer between wallets' })
export class MakeTransactionInputType {
    @Field(() => String, { description: "Receiver's wallet Id" })
    readonly toWalletId: string

    @Field(() => String, { description: "Sender's wallet Id" })
    readonly fromWalletId: string

    @Field(() => Float, { description: 'Money to transfer' })
    @IsPositive({ message: 'Money must be more than 0' })
    readonly money: number
}
