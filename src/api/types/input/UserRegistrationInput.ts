import { Field, InputType } from 'type-graphql'
import { IsEmail, IsNotEmpty, Validate } from 'class-validator'

import { IsAvailableUserEmail } from '../../validators/isAvailableUserEmail'
import { IsAvailableUserName } from '../../validators/isAvailableUserName'
import { User } from '../User'

@InputType()
export class UserRegistrationInput implements Partial<User> {
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
    public password: string
}
