import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator'

import { RoleService } from '../services/RoleService'

@ValidatorConstraint({ name: 'isAvailableRoleName' })
export class IsAvailableRoleName implements ValidatorConstraintInterface {
    constructor(private roleService: RoleService) {}

    async validate(name: string, args: ValidationArguments) {
        try {
            const [idProperty = undefined] = args.constraints || []
            const role = await this.roleService.findByNameInsensitive(name)
            if (!!idProperty && args.object[idProperty] && role) {
                return role.id === args.object[idProperty]
            }

            return !role
        } catch {
            return false
        }
    }

    defaultMessage(args: ValidationArguments) {
        return 'The role name ($value) is not available'
    }
}
