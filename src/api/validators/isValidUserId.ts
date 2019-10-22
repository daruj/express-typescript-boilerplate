import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator'

import { UserService } from '../services/UserService'

@ValidatorConstraint({ name: 'isValidUserId' })
export class IsValidUserId implements ValidatorConstraintInterface {
    constructor(private userService: UserService) {}

    async validate(id: string, args: ValidationArguments) {
        try {
            const user = await this.userService.findOne({ id })
            return !!user
        } catch {
            return false
        }
    }

    defaultMessage(args: ValidationArguments) {
        return 'The user id ($value) is not valid'
    }
}
