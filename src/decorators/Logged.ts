import Container, { ContainerInstance } from 'typedi'

import { Context } from '../api/Context'
import { Logger } from '../lib/logger'
import { Sources } from '../api/constants'
import { performance } from 'perf_hooks'

const loggerProperty = '_classLogger'

const registerLogger = (scope, object, options) => {
    Container.registerHandler({
        object: object,
        propertyName: loggerProperty,
        index: null,
        value: (container: ContainerInstance) => {
            if (container.has('context')) {
                const context = container.get<Context>('context')
                const requestId = context.requestId
                return new Logger(scope, { requestId, ...options })
            }
            return new Logger(scope, options)
        }
    })
}

const createWrapper = (callable, name) =>
    async function(this: any, ...args) {
        const start = performance.now()
        const result = await callable.apply(this, args)
        const end = performance.now()
        this[loggerProperty].debug('Executing method', {
            name,
            elapsed: (end - start).toFixed(4)
        })
        return result
    }

const wrapFunctions = object => {
    const prototype = object.prototype
    const descriptors = Object.getOwnPropertyDescriptors(prototype)

    Object.entries(descriptors)
        .filter(([propertyKey, _]) => propertyKey !== 'constructor')
        .forEach(([propertyKey, descriptor]) => {
            const name = `${object.name}:${String(propertyKey)}`
            object.prototype[propertyKey] = createWrapper(
                descriptor.value,
                name
            )
        })
}

const wrapFunction = (object, propertyKey, descriptor) => {
    const name = `${object.constructor.name}:${String(propertyKey)}`
    descriptor.value = createWrapper(descriptor.value, name)
}

export { Sources }

export interface ILoggedOptions {
    source: Sources
}

function decorateClass(scope, options, object) {
    registerLogger(scope, object.prototype, options)
    wrapFunctions(object)
}

function decorateMethod(scope, options, object, propertyKey, descriptor) {
    registerLogger(scope, object, options)
    wrapFunction(object, propertyKey, descriptor)
}

export function Logged(
    scope: string,
    options: Partial<ILoggedOptions> = {}
): Function {
    return (arg1, arg2, arg3) => {
        if (arg3) {
            decorateMethod(scope, options, arg1, arg2, arg3)
        } else {
            decorateClass(scope, options, arg1)
        }
    }
}
