import { Field, Float, ObjectType } from '@nestjs/graphql'

@ObjectType({ description: 'Wallet' })
export class WalletObjectType {
    @Field(() => String, { description: 'Id of the wallet' })
    id: string

    @Field(() => Float, { description: 'Incoming transfers to the wallet' })
    incoming: number

    @Field(() => Float, { description: 'Outgoing transfers from the wallet' })
    outgoing: number

    @Field(() => Float, { description: 'Current wallet balance' })
    actualBalance: number

    @Field(() => String, { description: 'Wallet owner Id' })
    ownerId: string
}
