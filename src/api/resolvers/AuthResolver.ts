import { Mutation, Resolver, Arg } from 'type-graphql'

import { Logged } from '../../decorators/Logged'
import { ROLES } from '../constants'
import { RoleService } from '../services/RoleService'
import { Service } from 'typedi'
import { User as UserModel } from '../models/User'
import { UserService } from '../services/UserService'
import { AuthService } from '../services/AuthService'
import { UserToken } from '../types/UserToken'
import { UserRegistrationInput } from '../types/input/UserRegistrationInput'
import { LocalAuth } from '../models/LocalAuth'
import { signToken } from '../../lib/jwt'

@Service()
@Resolver(of => LocalAuth)
@Logged(__filename)
export class LocalAuthResolver {
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private roleService: RoleService
    ) {}

    @Mutation(returns => UserToken)
    public async register(
        @Arg('input') input: UserRegistrationInput
    ): Promise<UserToken> {
        const user = new UserModel()
        const localAuth = new LocalAuth()

        user.firstName = input.firstName
        user.lastName = input.lastName
        user.email = input.email
        user.username = input.username
        user.role = await this.roleService.findByNameInsensitive(ROLES.USER)

        localAuth.user = await this.userService.create(user)
        localAuth.email = input.email
        localAuth.password = input.password

        await this.authService.create(localAuth)
        return {
            token: signToken(localAuth.user.id)
        }
    }
}
