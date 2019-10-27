import { Field, InputType } from 'type-graphql'
import { IsNotEmpty, Validate } from 'class-validator'

import { IsAvailableRoleName } from '../../validators/isAvailableRoleName'
import { IsValidRoleId } from '../../validators/isValidRoleId'
import { Role } from '../Role'

@InputType()
export class RoleInput implements Partial<Role> {
    @Field({ nullable: true })
    @Validate(IsValidRoleId)
    public id?: string

    @Field()
    @IsNotEmpty()
    @Validate(IsAvailableRoleName, ['id'])
    public name: string
}
