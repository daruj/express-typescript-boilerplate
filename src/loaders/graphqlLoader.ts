import * as path from 'path'

import {
    MicroframeworkLoader,
    MicroframeworkSettings
} from 'microframework-w3tec'
import { ResolverData, buildSchema } from 'type-graphql'
import { formatError, handlingErrors } from '../lib/graphql'

import { ApolloServer } from 'apollo-server-express'
import { Context } from '../api/Context'
import { authChecker } from '../auth/authChecker'
import { env } from '../env'

export const graphqlLoader: MicroframeworkLoader = async (
    settings: MicroframeworkSettings | undefined
) => {
    if (settings && env.graphql.enabled) {
        const expressApp = settings.getData('express_app')
        const expressServer = settings.getData('express_server')
        const schema = await buildSchema({
            resolvers: env.app.dirs.resolvers,
            // automatically create `schema.gql` file with schema definition in current folder
            emitSchemaFile: path.resolve(__dirname, '../api', 'schema.gql'),
            authChecker,
            container: (data: ResolverData<Context>) => data.context.container
        })

        handlingErrors({ ...schema })

        const server = new ApolloServer({
            schema,
            playground: true,
            context: ({ req }: { req: any }) => {
                return req.context
            },
            formatError,
            subscriptions: {
                path: '/subscriptions'
            }
        })
        server.applyMiddleware({
            app: expressApp,
            path: env.graphql.route
        })

        server.installSubscriptionHandlers(expressServer)
    }
}
