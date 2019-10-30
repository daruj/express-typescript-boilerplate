import {
    MicroframeworkLoader,
    MicroframeworkSettings
} from 'microframework-w3tec'

import { AuthService } from '../api/services/AuthService'
import { Container } from 'typedi'
import FacebookTokenStrategy from 'passport-facebook-token'
import { Strategy as GoogleStrategy } from 'passport-token-google2'
import { LocalAuth } from '../api/models/LocalAuth'
import LocalStrategy from 'passport-local'
import { ROLES } from '../api/constants'
import { RoleService } from '../api/services/RoleService'
import { User } from '../api/models/User'
import { UserService } from '../api/services/UserService'
import { env } from '../env'
import passport from 'passport'
import { signToken } from '../lib/jwt'
import uuid from 'uuid'

export const passportLoader: MicroframeworkLoader = (
    settings: MicroframeworkSettings | undefined
) => {
    if (settings) {
        const expressApp = settings.getData('express_app')
        const authService = Container.get<AuthService>(AuthService)
        const userService = Container.get<UserService>(UserService)
        const roleService = Container.get<RoleService>(RoleService)

        const authenticateResponse = (err, user) => res => {
            if (err) {
                if (err.oauthError) {
                    res.send(401)
                } else {
                    res.send(err)
                }
            } else {
                if (user) {
                    res.send({ token: signToken(user.id) })
                } else {
                    res.send(401)
                }
            }
        }

        const authenticateInSocialMedia = async (
            socialMedia: string,
            profile: any,
            done
        ) => {
            try {
                const id = profile.id
                const email = profile.emails[0].value
                const socialUser = await authService.findOneByAccountId(
                    socialMedia,
                    id
                )
                if (!socialUser) {
                    // Check if user already exists

                    let user = await userService.findOne({
                        email
                    })

                    if (!user) {
                        // Create the user
                        const newUser = new User()
                        const userId = uuid.v4()
                        newUser.id = userId
                        newUser.firstName = profile.name.givenName
                        newUser.lastName = profile.name.familyName
                        newUser.email = profile.emails[0].value
                        newUser.username = `${profile.name.givenName}.${
                            profile.name.familyName
                        }.${userId.split('-')[3]}`.toLowerCase()
                        newUser.active = true
                        newUser.role = await roleService.findOne({
                            name: ROLES.USER
                        })
                        user = await userService.create(newUser)
                    }

                    // Create the new Social User
                    await authService.createSocialMedialUser(socialMedia, {
                        id,
                        email,
                        user
                    })

                    return done(null, user)
                }

                return done(null, await userService.findOne({ email }))
            } catch (error) {
                return done(error, false, error.message)
            }
        }

        /* Initialize passport */

        passport.serializeUser(function(user, done) {
            done(null, user)
        })

        passport.deserializeUser(function(obj, done) {
            done(null, obj)
        })

        expressApp.use(passport.initialize())
        expressApp.use(passport.session())

        /* Local Strategy */

        if (env.oauth.local.enabled) {
            passport.use(
                new LocalStrategy(
                    {
                        usernameField: 'email',
                        session: false
                    },
                    async (email, password, done) => {
                        try {
                            // Find the user given the email
                            const localAuthUser = await authService.findOne({
                                email
                            })

                            // If not, handle it
                            if (!localAuthUser) {
                                return done(null, false)
                            }

                            // Check if the password is correct
                            const isMatch = await LocalAuth.comparePassword(
                                localAuthUser,
                                password
                            )

                            // If not, handle it
                            if (!isMatch) {
                                return done(null, false)
                            }

                            // Otherwise, return the user
                            return done(null, localAuthUser.user)
                        } catch (error) {
                            return done(error, false)
                        }
                    }
                )
            )

            expressApp.post(env.oauth.local.authUrl, (req, res) => {
                passport.authenticate(
                    'local',
                    { session: false },
                    (err, user) => authenticateResponse(err, user)(res)
                )(req, res)
            })
        }

        /* Facebook Strategy */

        if (env.oauth.facebook.enabled) {
            passport.use(
                'facebookToken',
                new FacebookTokenStrategy(
                    {
                        clientID: env.oauth.facebook.appId,
                        clientSecret: env.oauth.facebook.appSecret,
                        fbGraphVersion: 'v3.0'
                    },
                    (accessToken, refreshToken, profile, done) =>
                        authenticateInSocialMedia('facebook', profile, done)
                )
            )

            expressApp.post(env.oauth.facebook.authUrl, (req, res) => {
                passport.authenticate(
                    'facebookToken',
                    { session: false },
                    (err, user) => authenticateResponse(err, user)(res)
                )(req, res)
            })
        }

        /* Google Strategy */
        // For this Strategy the access_token is in fact the id_token!

        if (env.oauth.google.enabled) {
            passport.use(
                'google-token',
                new GoogleStrategy(
                    {
                        clientID: env.oauth.google.appId,
                        clientSecret: env.oauth.google.appSecret
                    },
                    (accessToken, refreshToken, profile, done) =>
                        authenticateInSocialMedia('google', profile, done)
                )
            )

            expressApp.post(env.oauth.google.authUrl, (req, res) => {
                passport.authenticate(
                    'google-token',
                    { session: false },
                    (err, user) => authenticateResponse(err, user)(res)
                )(req, res)
            })
        }
    }
}
