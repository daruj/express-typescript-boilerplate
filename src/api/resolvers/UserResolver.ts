import { Query, Resolver, Ctx, Authorized } from 'type-graphql'

import { Logged } from '../../decorators/Logged'
import { ROLES } from '../constants'
import { Service } from 'typedi'
import { User } from '../types/User'
import { UserService } from '../services/UserService'
import { Context } from '../Context'

@Service()
@Resolver(of => User)
@Logged(__filename)
export class UserResolver {
    constructor(private userService: UserService) {}

    @Query(returns => User)
    @Authorized(ROLES.SUPER_ADMIN, ROLES.USER)
    public me(@Ctx() { user }: Context): Promise<User> {
        return this.userService.findOne({ id: user.id })
    }

    @Query(returns => [User])
    public users(): Promise<User[]> {
        return this.userService.find()
    }
}
