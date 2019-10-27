import { Field, ObjectType } from 'type-graphql'

@ObjectType({
    description: 'Me object.'
})
export class UserToken {
    @Field({
        description: 'The user token.'
    })
    public token?: string
}
