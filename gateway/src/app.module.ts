import { ApolloGatewayDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { config } from './config/config'
import { graphqlConfig } from './config/graphql.config'

@Module({
    imports: [
        ConfigModule.forRoot(config),
        GraphQLModule.forRoot<ApolloGatewayDriverConfig>(graphqlConfig),
    ],
})
export class AppModule {}
