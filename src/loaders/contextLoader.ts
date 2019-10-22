import * as express from 'express'
import * as uuid from 'uuid'

import {
    MicroframeworkLoader,
    MicroframeworkSettings
} from 'microframework-w3tec'

import { ContainerInstance } from 'typedi'
import { Context } from '../api/Context'

export const contextLoader: MicroframeworkLoader = (
    settings: MicroframeworkSettings | undefined
) => {
    if (settings) {
        const expressApp = settings.getData('express_app')

        // Add graphql layer to the express app
        expressApp.use(
            (
                request: any,
                response: express.Response,
                next: express.NextFunction
            ) => {
                // Build request uuid
                const requestId = uuid.v4()

                // Create container instance by hand so it does not stay
                // referenced by the global container.
                const container = new ContainerInstance(requestId)

                // Build GraphQL context
                const context: Context = {
                    requestId,
                    container,
                    request,
                    response,
                    user: request.user
                }

                // Make the context available through the container itself.
                container.set('context', context)

                // Mark it as scoped to enable cached loaders.
                container.set('scoped', true)

                // Save context to the request.
                request.context = context

                return next()
            }
        )
    }
}
