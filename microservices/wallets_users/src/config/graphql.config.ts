import {
    ApolloFederationDriver,
    ApolloFederationDriverConfig,
} from '@nestjs/apollo'

export const graphqlConfig: ApolloFederationDriverConfig = {
    driver: ApolloFederationDriver,
    autoSchemaFile: true,
}
