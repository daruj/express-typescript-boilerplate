import 'reflect-metadata'

import { Logger } from './lib/logger'
import { authLoader } from './loaders/authLoader'
import { banner } from './lib/banner'
import { bootstrapMicroframework } from 'microframework-w3tec'
import { contextLoader } from './loaders/contextLoader'
import { eventDispatchLoader } from './loaders/eventDispatchLoader'
import { expressLoader } from './loaders/expressLoader'
import { graphqlLoader } from './loaders/graphqlLoader'
import { homeLoader } from './loaders/homeLoader'
import { iocLoader } from './loaders/iocLoader'
import { monitorLoader } from './loaders/monitorLoader'
import { passportLoader } from './loaders/passportLoader'
import { publicLoader } from './loaders/publicLoader'
import { swaggerLoader } from './loaders/swaggerLoader'
import { typeormLoader } from './loaders/typeormLoader'
import { winstonLoader } from './loaders/winstonLoader'

/**
 * EXPRESS TYPESCRIPT BOILERPLATE
 * ----------------------------------------
 *
 * This is a boilerplate for Node.js Application written in TypeScript.
 * The basic layer of this app is express. For further information visit
 * the 'README.md' file.
 */
const log = new Logger(__filename)

bootstrapMicroframework({
    /**
     * Loader is a place where you can configure all your modules during microframework
     * bootstrap process. All loaders are executed one by one in a sequential order.
     */
    loaders: [
        winstonLoader,
        iocLoader,
        eventDispatchLoader,
        typeormLoader,
        expressLoader,
        swaggerLoader,
        monitorLoader,
        homeLoader,
        publicLoader,
        passportLoader,
        authLoader,
        contextLoader,
        graphqlLoader
    ]
})
    .then(() => banner(log))
    .catch(error => log.error('Application is crashed: ' + error.stack))
