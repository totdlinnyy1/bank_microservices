import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { WalletsService } from '../wallets/wallets.service'

import { CreateUserDto } from './dtos/createUser.dto'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UsersService {
    private readonly _logger: Logger = new Logger(UsersService.name)

    constructor(
        @InjectRepository(UserEntity)
        private readonly _usersRepository: Repository<UserEntity>,
        private readonly _walletsService: WalletsService,
    ) {}

    // Single user get function
    async user(id: string): Promise<UserEntity> {
        this._logger.debug('START GET USER BY ID')
        this._logger.debug(id)

        this._logger.debug('CHECK IF USER EXIST')
        const candidate = await this._usersRepository.findOne({
            where: { id },
        })
        this._logger.debug({ candidate })

        if (!candidate) {
            this._logger.debug('USER DOES NOT EXIST')
            throw new NotFoundException('This user does not exist')
        }

        this._logger.debug('RETURN USER')
        return candidate
    }

    // Users get function
    async users(): Promise<UserEntity[]> {
        this._logger.debug('START GET USERS')
        const users = await this._usersRepository.find()
        this._logger.debug({ users })

        this._logger.debug('RETURN USERS')
        return users
    }

    // User creation function
    async create(createUserData: CreateUserDto): Promise<UserEntity> {
        this._logger.debug('START CREATE USER')
        this._logger.debug({ createUserData })

        this._logger.debug('CHECK IF USER EXIST')
        const candidate = await this._usersRepository.findOne({
            email: createUserData.email,
        })
        this._logger.debug({ candidate })

        // Checking if there is a user with the same email
        if (candidate) {
            this._logger.debug('THIS USER IS ALREADY EXIST')
            throw new BadRequestException('This user is already exists')
        }

        this._logger.debug('SAVE USER TO DATABASE')
        const user = await this._usersRepository.save(createUserData)
        this._logger.debug({ user })

        this._logger.debug('RETURN USER')
        return await this.user(user.id)
    }

    // The function deletes the user
    async delete(id: string): Promise<string> {
        this._logger.debug('START DELETE USER BY ID')
        this._logger.debug(id)

        // Checking if such a user exists
        await this.user(id)

        // Deleting a user
        await this._usersRepository.softDelete({ id })

        // Blocking wallets, true if wallets are blocked, false if there were no wallets, or they are closed
        const isWalletsLocked = await this._walletsService.lock({
            ownerId: id,
        })

        this._logger.debug('IS USER WALLETS LOCKED')
        this._logger.debug(isWalletsLocked)

        if (!isWalletsLocked) {
            this._logger.debug('USER DOES NOT HAVE ANY WALLETS, RETURN RESULT')
            return 'User deleted, wallets not found'
        }

        this._logger.debug('USER HAVE WALLETS, WALLETS LOCKED, RETURN RESULT')
        return 'User deleted, wallets blocked'
    }
}
