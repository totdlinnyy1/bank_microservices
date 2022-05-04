import { Logger, UsePipes, ValidationPipe } from '@nestjs/common'
import {
    Resolver,
    Query,
    Args,
    Mutation,
    ResolveField,
    Parent,
} from '@nestjs/graphql'

import { WalletObjectType } from '../wallets/graphql/wallet.object-type'
import { WalletsService } from '../wallets/wallets.service'

import { CreateUserInputType } from './graphql/inputs/createUser.input-type'
import { UserObjectType } from './graphql/user.object-type'
import { UsersService } from './users.service'

@Resolver(() => UserObjectType)
export class UsersResolver {
    private readonly _logger: Logger = new Logger(UsersResolver.name)

    constructor(
        private readonly _usersService: UsersService,
        private readonly _walletsService: WalletsService,
    ) {}

    // Query to get a single user
    @Query(() => UserObjectType)
    async user(
        @Args('id', { type: () => String })
        id: string,
    ): Promise<UserObjectType> {
        this._logger.debug('GET USER BY ID')
        this._logger.debug(id)
        return await this._usersService.user(id)
    }

    // Request to get users
    @Query(() => [UserObjectType])
    async users(): Promise<UserObjectType[]> {
        this._logger.debug('GET USERS')
        return await this._usersService.users()
    }

    // Resolve user wallets
    @ResolveField(() => [WalletObjectType])
    async wallets(@Parent() user: UserObjectType): Promise<WalletObjectType[]> {
        return await this._walletsService.walletsByOwnerId(user.id)
    }

    // Mutation to create a user
    @Mutation(() => UserObjectType)
    @UsePipes(new ValidationPipe())
    async createUser(
        @Args('input', { type: () => CreateUserInputType })
        input: CreateUserInputType,
    ): Promise<UserObjectType> {
        this._logger.debug('CREATE USER')
        this._logger.debug({ input })
        return await this._usersService.create(input)
    }

    // Mutation to delete a user
    @Mutation(() => String)
    async deleteUser(
        @Args('id', { type: () => String })
        id: string,
    ): Promise<string> {
        this._logger.debug('DELETE USER BY ID')
        this._logger.debug(id)
        return await this._usersService.delete(id)
    }
}
