import { Field, InputType } from 'type-graphql'
import { IsEmail, IsNotEmpty, Validate } from 'class-validator'

import { IsAvailableUserEmail } from '../../validators/isAvailableUserEmail'
import { IsAvailableUserName } from '../../validators/isAvailableUserName'
import { IsValidRoleId } from '../../validators/isValidRoleId'
import { IsValidUserId } from '../../validators/IsValidUserId'
import { User } from '../User'

@InputType()
export class UserInput implements Partial<User> {
    @Field({ nullable: true })
    @Validate(IsValidUserId)
    public id?: string

    @Field()
    @IsNotEmpty()
    public firstName: string

    @Field()
    @IsNotEmpty()
    public lastName: string

    @Field()
    @IsNotEmpty()
    @Validate(IsAvailableUserName)
    public username: string

    @Field()
    @IsEmail()
    @Validate(IsAvailableUserEmail)
    public email: string

    @Field()
    @Validate(IsValidRoleId)
    public role_id: string
}
