import { EntityRepository, Repository } from 'typeorm'

import { LocalAuth } from '../models/LocalAuth'

@EntityRepository(LocalAuth)
export class LocalAuthRepository extends Repository<LocalAuth> {}
