import { Field, ObjectType } from 'type-graphql'

@ObjectType({
    description: 'Result object.'
})
export class Result {
    @Field()
    public result: boolean

    @Field()
    public message: string
}

export class SuccessResult extends Result {
    constructor(public message) {
        super()
        this.result = true
    }
}

export class ErrorResult extends Result {
    constructor(public message) {
        super()
        this.result = false
    }
}
