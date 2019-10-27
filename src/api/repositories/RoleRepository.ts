import { EntityRepository, Repository } from 'typeorm'

import { Role } from '../models/Role'

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
    public findOneInsensitive(name: string): Promise<Role> {
        return this.createQueryBuilder()
            .where('LOWER(name) = LOWER(:name)', { name })
            .getOne()
    }
}
