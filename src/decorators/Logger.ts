import { Container, ContainerInstance } from 'typedi'

import { Context } from '../api/Context'
import { Sources } from '../api/constants'
import { Logger as WinstonLogger } from '../lib/logger'

export { Sources }

export interface ILoggedOptions {
    source: Sources
}

export function Logger(
    scope: string,
    options: Partial<ILoggedOptions> = {}
): ParameterDecorator {
    return (object, propertyKey, index): any => {
        const propertyName = propertyKey ? propertyKey.toString() : ''
        Container.registerHandler({
            object,
            propertyName,
            index,
            value: (container: ContainerInstance) => {
                if (container.has('context')) {
                    const context = container.get<Context>('context')
                    const requestId = context.requestId
                    return new WinstonLogger(scope, { requestId, ...options })
                }
                return new WinstonLogger(scope, options)
            }
        })
    }
}

export { LoggerInterface } from '../lib/logger'
