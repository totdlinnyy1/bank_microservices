import { Field, Float, InputType } from '@nestjs/graphql'
import { IsPositive } from 'class-validator'

@InputType({ description: 'Input for deposit or withdraw to wallet' })
export class DepositOrWithdrawInputType {
    @Field(() => String, { description: 'Wallet Id' })
    readonly id: string

    @Field(() => Float, { description: 'Money to deposit or withdraw' })
    @IsPositive({ message: 'Money must be more than 0' })
    readonly money: number
}
