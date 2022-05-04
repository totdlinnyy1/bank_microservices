import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserObjectType {
    @Field(() => String, { description: 'User Id' })
    id: string

    @Field(() => String, { description: 'User name' })
    name: string

    @Field(() => String, { description: 'User email' })
    email: string
}
