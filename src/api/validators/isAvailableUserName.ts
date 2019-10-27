import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator'

import { UserService } from '../services/UserService'

@ValidatorConstraint({ name: 'isAvailableUserName' })
export class IsAvailableUserName implements ValidatorConstraintInterface {
    constructor(private userService: UserService) {}

    async validate(username: string, args: ValidationArguments) {
        try {
            const { id } = args.object as any
            const user = await this.userService.findOne({ username })

            if (id && user) {
                return id === user.id
            }

            return !user
        } catch {
            return false
        }
    }

    defaultMessage(args: ValidationArguments) {
        return 'The user name ($value) is not available'
    }
}
