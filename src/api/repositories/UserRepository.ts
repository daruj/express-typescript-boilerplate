import { EntityRepository, Repository } from 'typeorm'

import { User } from '../models/User'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    public findAllByRoleId(roleId: string): Promise<User[]> {
        return this.createQueryBuilder()
            .select()
            .where('role_id = :roleId', { roleId })
            .getMany()
    }
}
