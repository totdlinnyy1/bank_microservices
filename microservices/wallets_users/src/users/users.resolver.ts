import { Logger, UsePipes, ValidationPipe } from '@nestjs/common'
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'

import { CreateUserInputType } from './graphql/inputs/createUser.input-type'
import { UserObjectType } from './graphql/user.object-type'
import { UsersService } from './users.service'

@Resolver(() => UserObjectType)
export class UsersResolver {
    private readonly _logger: Logger = new Logger(UsersResolver.name)

    constructor(private readonly _usersService: UsersService) {}

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

    // TODO add wallet resolve field

    // Mutation to create a user
    @Mutation(() => UserObjectType)
    @UsePipes(new ValidationPipe())
    async createUser(
        @Args('createUserData', { type: () => CreateUserInputType })
        createUserData: CreateUserInputType,
    ): Promise<UserObjectType> {
        this._logger.debug('CREATE USER')
        this._logger.debug({ createUserData })
        return await this._usersService.create(createUserData)
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
