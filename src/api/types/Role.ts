import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType({
    description: 'Role object.'
})
export class Role {
    @Field(type => ID, {
        description: 'The role id'
    })
    public id: string

    @Field({
        description: 'The name of the role.'
    })
    public name: string

    @Field({
        description: 'When was the role created.'
    })
    public created_at: Date

    @Field({
        description: 'When was the role updated.'
    })
    public updated_at: Date
}
