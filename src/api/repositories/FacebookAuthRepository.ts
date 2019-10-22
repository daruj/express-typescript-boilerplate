import { EntityRepository, Repository } from 'typeorm'

import { FacebookAuth } from '../models/FacebookAuth'

@EntityRepository(FacebookAuth)
export class FacebookAuthRepository extends Repository<FacebookAuth> {}
