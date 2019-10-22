import { Service } from 'typedi'
import { OrmRepository } from 'typeorm-typedi-extensions'
import { User } from '../models/User'
import { Logger, LoggerInterface } from '../../decorators/Logger'
import { FacebookAuthRepository } from '../repositories/FacebookAuthRepository'
import { GoogleAuthRepository } from '../repositories/GoogleAuthRepository'
import { LocalAuthRepository } from '../repositories/LocalAuthRepository'
import { Logged, Sources } from '../../decorators/Logged'
import { LocalAuth } from '../models/LocalAuth'
import { SocialMediaAuth } from '../models/SocialMedialAuth'

@Service()
@Logged(__filename, { source: Sources.DB })
export class AuthService {
    constructor(
        @OrmRepository() private localAuthRepository: LocalAuthRepository,
        @OrmRepository() private facebookAuthRepository: FacebookAuthRepository,
        @OrmRepository() private googleAuthRepository: GoogleAuthRepository,
        @Logger(__filename) private log: LoggerInterface
    ) {}

    /* Local Auth */

    public findOne(where: { email: string }): Promise<LocalAuth | undefined> {
        this.log.info('Find an local auth user')
        const relations = { relations: ['user'] }
        return this.localAuthRepository.findOne(where, relations)
    }

    public create(user: LocalAuth): Promise<LocalAuth> {
        this.log.info('Create a new local auth user => ', user.toString())
        return this.localAuthRepository.save(user)
    }

    /* Social Medial Fb / Google */

    public findOneByAccountId(
        socialMedia,
        accountId: string
    ): Promise<SocialMediaAuth | undefined> {
        switch (socialMedia) {
            case 'facebook':
                return this.facebookAuthRepository.findOne(
                    { accountId },
                    { relations: ['user'] }
                )
            case 'google':
                return this.googleAuthRepository.findOne(
                    { accountId },
                    { relations: ['user'] }
                )
            default:
                return undefined
        }
    }

    public createSocialMedialUser(
        socialMedia,
        profile: {
            id: string
            email: string
            user: User
        }
    ): Promise<SocialMediaAuth | undefined> {
        const newUser = new SocialMediaAuth()
        newUser.accountId = profile.id
        newUser.email = profile.email
        newUser.user = profile.user
        switch (socialMedia) {
            case 'facebook':
                return this.facebookAuthRepository.save(newUser)
            case 'google':
                return this.googleAuthRepository.save(newUser)
            default:
                return undefined
        }
    }
}
