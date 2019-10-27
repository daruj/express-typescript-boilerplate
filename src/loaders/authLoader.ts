import * as express from 'express'

import { ExtractJwt, Strategy } from 'passport-jwt'
import {
    MicroframeworkLoader,
    MicroframeworkSettings
} from 'microframework-w3tec'

import { User } from '../api/models/User'
import { env } from '../env'
import passport from 'passport'

export const authLoader: MicroframeworkLoader = (
    settings: MicroframeworkSettings | undefined
) => {
    if (settings) {
        const expressApp = settings.getData('express_app')
        const connection = settings.getData('connection')

        passport.use(
            new Strategy(
                {
                    secretOrKey: env.jwt.secret,
                    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
                },
                async (payload, done) => {
                    if (payload && payload.sub) {
                        // Find the user specified in token
                        const user = await connection
                            .getRepository(User)
                            .findOne(
                                {
                                    id: payload.sub
                                },
                                {
                                    relations: ['role']
                                }
                            )

                        // If user doesn't exists, handle it
                        if (!user) {
                            return done(null, false)
                        }

                        // Otherwise, return the user
                        return done(null, user)
                    }
                    return done(null, false)
                }
            )
        )

        expressApp.use(
            env.graphql.route,
            (req: any, res: express.Response, next: express.NextFunction) => {
                passport.authenticate(
                    'jwt',
                    { session: false },
                    (err, user) => {
                        if (user) {
                            req.user = user
                        }

                        next()
                    }
                )(req, res, next)
            }
        )
    }
}
