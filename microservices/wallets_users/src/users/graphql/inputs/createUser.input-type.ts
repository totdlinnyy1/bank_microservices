import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, MinLength } from 'class-validator'

@InputType({ description: 'Input for user create' })
export class CreateUserInputType {
    @Field(() => String, { description: 'User name' })
    @MinLength(1, { message: 'Name is incorrect' })
    readonly name: string

    @Field(() => String, { description: 'User Email' })
    @IsEmail({}, { message: 'Email is incorrect' })
    readonly email: string
}
