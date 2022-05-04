import { Field, InputType } from '@nestjs/graphql'

@InputType({ description: 'Input for wallet create' })
export class CreateWalletInputType {
    @Field(() => String, { description: 'Wallet owner Id' })
    readonly ownerId: string
}
