import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator'

import { UserService } from '../services/UserService'

@ValidatorConstraint({ name: 'isAvailableUserEmail' })
export class IsAvailableUserEmail implements ValidatorConstraintInterface {
    constructor(private userService: UserService) {}

    async validate(email: string, args: ValidationArguments) {
        try {
            const { id } = args.object as any
            const user = await this.userService.findOne({ email })

            if (id && user) {
                return id === user.id
            }

            return !user
        } catch {
            return false
        }
    }

    defaultMessage(args: ValidationArguments) {
        return 'The user email ($value) is not available'
    }
}
