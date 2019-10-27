import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'

import { ROLES } from '../constants'
import { Role as RoleModel } from '../models/Role'
import { RoleService } from '../services/RoleService'
import { RoleInput } from '../types/input/RoleInput'
import { RemoveRoleInput } from '../types/input/RemoveRoleInput'
import { Role } from '../types/Role'
import { Result, SuccessResult } from '../types/Result'
import { Logged } from '../../decorators/Logged'

@Service()
@Resolver(of => Role)
@Logged(__filename)
export class RoleResolver {
    constructor(private roleService: RoleService) {}

    @Authorized(ROLES.SUPER_ADMIN)
    @Query(returns => [Role])
    public roles(): Promise<any> {
        return this.roleService.findAll()
    }

    @Authorized(ROLES.SUPER_ADMIN)
    @Query(returns => Role)
    public role(@Arg('name', { nullable: false }) name: string): Promise<any> {
        return this.roleService.findOne({ name })
    }

    @Authorized(ROLES.SUPER_ADMIN)
    @Mutation(returns => Role)
    public addRole(@Arg('input') input: RoleInput): Promise<RoleModel> {
        const newRole = new RoleModel()
        newRole.name = input.name
        return this.roleService.create(newRole)
    }

    @Authorized(ROLES.SUPER_ADMIN)
    @Mutation(returns => Role)
    public updateRole(@Arg('input') input: RoleInput): Promise<Role> {
        const newRole = new RoleModel()
        newRole.name = input.name
        return this.roleService.update(input.id, newRole)
    }

    @Authorized(ROLES.SUPER_ADMIN)
    @Mutation(returns => Result)
    public async removeRole(
        @Arg('input', { nullable: false }) input: RemoveRoleInput
    ): Promise<Result> {
        await this.roleService.delete(input.id)

        return new SuccessResult('Role deleted')
    }
}
