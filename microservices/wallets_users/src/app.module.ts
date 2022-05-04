import { ApolloFederationDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'

import { config } from './config/config'
import { graphqlConfig } from './config/graphql.config'
import { typeOrmConfig } from './config/typeorm.config'
import { UsersModule } from './users/users.module'

@Module({
    imports: [
        ConfigModule.forRoot(config),
        TypeOrmModule.forRootAsync(typeOrmConfig),
        GraphQLModule.forRoot<ApolloFederationDriverConfig>(graphqlConfig),
        UsersModule,
    ],
})
export class AppModule {}
