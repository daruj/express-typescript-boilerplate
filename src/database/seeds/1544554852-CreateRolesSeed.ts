import { Factory, Seed } from 'typeorm-seeding'

import { Connection } from 'typeorm'
import { Role } from '../../../src/api/models/Role'

export class CreateRolesSeed implements Seed {
    public async seed(factory: Factory, connection: Connection): Promise<any> {
        try {
            return await connection
                .createQueryBuilder()
                .insert()
                .into(Role)
                .values([
                    {
                        id: 'd8148380-f8cc-11e8-b0a5-1b7311cc8cb9',
                        name: 'Super Admin'
                    },
                    {
                        id: 'f7d59041-f8ce-11e8-b589-c7aa4907c60e',
                        name: 'User'
                    }
                ])
                .execute()
        } catch (error) {
            console.log(error.message)
        }
    }
}
