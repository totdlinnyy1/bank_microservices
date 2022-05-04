import { IntrospectAndCompose } from '@apollo/gateway'
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo'

export const graphqlConfig: ApolloGatewayDriverConfig = {
    driver: ApolloGatewayDriver,
    gateway: {
        supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
                { name: 'users_wallets', url: 'http://localhost:3001/graphql' },
            ],
        }),
    },
}
