import { Container, ContainerInstance } from 'typedi'

import { CachedLoaders } from '../lib/CachedLoaders'
import { find } from 'lodash'

const loadersProperty = '_cachedLoaders'

const registerLoaders = object => {
    const previous = find(Container.handlers, {
        object: { constructor: object.constructor },
        propertyName: loadersProperty
    })
    if (previous) {
        return
    }
    Container.registerHandler({
        object: object,
        propertyName: loadersProperty,
        index: null,
        value: (container: ContainerInstance) => container.get(CachedLoaders)
    })
}

const composeName = (object, propertyKey) =>
    `${object.constructor.name}:${String(propertyKey)}`

export function CachedLoader<T>(): MethodDecorator {
    return (object, propertyKey, descriptor: any) => {
        registerLoaders(object)

        const name = composeName(object, propertyKey)
        const callable = descriptor.value

        const fetchLoader = self => {
            const loaders = self[loadersProperty]
            return loaders.create(name, () => ({
                generator: ({ self, args }) => {
                    return callable.apply(self, args)
                },
                cacheKeyFn: ({ self, args }) => JSON.stringify(args)
            }))
        }

        const wrapper = function(this: any, ...args) {
            const loader = fetchLoader(this)
            return loader.load({ self: this, args })
        }

        descriptor.value = wrapper
    }
}

export const invalidateCache = <T, U extends keyof T>(
    self: T,
    propertyKey: U,
    ...args
) => {
    const loaders = self[loadersProperty]
    const name = composeName(self, propertyKey)
    const loader = loaders.get(name)
    if (loader) {
        loader.clear({ self, args })
    }
}
