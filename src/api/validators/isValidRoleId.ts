import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator'

import { RoleService } from '../services/RoleService'
import { UserService } from '../services/UserService'

@ValidatorConstraint({ name: 'isValidRoleId' })
export class IsValidRoleId implements ValidatorConstraintInterface {
    constructor(
        private userService: UserService,
        private roleService: RoleService
    ) {}

    async validate(id: string, args: ValidationArguments) {
        try {
            if (!(await this.roleService.findOne({ id }))) {
                return false
            }
            const [toRemove = false] = args.constraints || []
            if (!toRemove) {
                return true
            }
            const users = await this.userService.findAllByRoleId(id)
            return users.length === 0
        } catch {
            return false
        }
    }

    defaultMessage(args: ValidationArguments) {
        const [toRemove = false] = args.constraints || []
        if (toRemove) {
            return (
                'The role identified by id ($value) can not be deleted ' +
                'because users have references to it.'
            )
        }
        return 'The role id ($value) is not valid'
    }
}
