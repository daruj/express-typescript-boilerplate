import * as express from 'express'
import { Service } from 'typedi'
import { OrmRepository } from 'typeorm-typedi-extensions'

import { User } from '../api/models/User'

import { Logger, LoggerInterface } from '../decorators/Logger'
import { LocalAuth } from '../api/models/LocalAuth'
import { LocalAuthRepository } from '../api/repositories/LocalAuthRepository'
import { UserRepository } from '../api/repositories/UserRepository'

@Service()
export class AuthService {
    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private localAuthRepository: LocalAuthRepository,
        @OrmRepository() private userRepository: UserRepository
    ) {}

    public parseBasicAuthFromRequest(
        req: express.Request
    ): { username: string; password: string } {
        const authorization = req.header('authorization')

        if (authorization && authorization.split(' ')[0] === 'Basic') {
            this.log.info('Credentials provided by the client')
            const decodedBase64 = Buffer.from(
                authorization.split(' ')[1],
                'base64'
            ).toString('ascii')
            const username = decodedBase64.split(':')[0]
            const password = decodedBase64.split(':')[1]
            if (username && password) {
                return { username, password }
            }
        }

        this.log.info('No credentials provided by the client')
        return undefined
    }

    public async validateUser(
        username: string,
        password: string
    ): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { username }
        })

        const localAuthUser = await this.localAuthRepository.findOne({
            where: {
                email: user.email
            }
        })

        if (await LocalAuth.comparePassword(localAuthUser, password)) {
            return user
        }

        return undefined
    }
}
