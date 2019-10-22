import {
    MicroframeworkLoader,
    MicroframeworkSettings
} from 'microframework-w3tec'

import { Application } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { createExpressServer } from 'routing-controllers'
import { env } from '../env'
import flash from 'connect-flash'
import session from 'express-session'

export const expressLoader: MicroframeworkLoader = (
    settings: MicroframeworkSettings | undefined
) => {
    if (settings) {
        /**
         * We create a new express server instance.
         * We could have also use useExpressServer here to attach controllers to an existing express instance.
         */
        const expressApp: Application = createExpressServer({
            cors: true,
            classTransformer: true,
            routePrefix: env.app.routePrefix,
            defaultErrorHandler: false,
            /**
             * We can add options about how routing-controllers should configure itself.
             * Here we specify what controllers should be registered in our express server.
             */
            controllers: env.app.dirs.controllers,
            middlewares: env.app.dirs.middlewares,
            interceptors: env.app.dirs.interceptors

            /**
             * Authorization features
             */
        })

        // Run application to listen on given port
        if (!env.isTest) {
            const server = expressApp.listen(env.app.port)
            settings.setData('express_server', server)
        }

        expressApp.use(bodyParser.json())
        expressApp.use(cookieParser())
        expressApp.use(session({ secret: env.app.session.secret }))
        expressApp.use(flash())

        // Here we can set the data for other loaders
        settings.setData('express_app', expressApp)
    }
}
