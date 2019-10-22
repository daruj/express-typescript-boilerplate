import { Field, InputType } from 'type-graphql'

import { IsValidRoleId } from '../../validators/isValidRoleId'
import { Validate } from 'class-validator'

@InputType()
export class RemoveRoleInput {
    @Field()
    @Validate(IsValidRoleId, [true])
    id: string
}
