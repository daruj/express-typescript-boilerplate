import { ContainerInstance, Service } from 'typedi'

import DataLoader from 'dataloader'

type Factory = () => {
    generator: (...args) => any
    cacheKeyFn?: (any) => string
}

@Service()
export class CachedLoaders {
    // Only do caching for scoped containers top avoid memory leaks.
    private scoped: boolean

    constructor() {
        // Check if we are in a scoped container:
        // * For scoped services typedi should pass the container itself as a
        //   hidden alst argument.
        // * It should be a container instance.
        // * It should claim to know the `context`.
        this.scoped = false
        const container = arguments[0]
        if (container instanceof ContainerInstance) {
            this.scoped = container.has('scoped')
        }
    }

    private loaders: { [name: string]: DataLoader<any, any> } = {}

    private createHandler(generator) {
        return keys => {
            if (Array.isArray(keys)) {
                return Promise.all(keys.map(generator))
            } else {
                return generator(keys)
            }
        }
    }

    public create(name: string, factory: Factory): DataLoader<any, any> {
        if (!!this.loaders[name]) {
            return this.loaders[name]
        }

        const { generator, cacheKeyFn = key => key } = factory()
        const loader = new DataLoader<any, any>(this.createHandler(generator), {
            cache: this.scoped,
            cacheKeyFn,
            batch: false
        })
        this.loaders[name] = loader

        return loader
    }

    public get(name: string) {
        return this.loaders[name]
    }
}
