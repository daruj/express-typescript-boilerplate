import { EntityRepository, Repository } from 'typeorm'

import { GoogleAuth } from '../models/GoogleAuth'

@EntityRepository(GoogleAuth)
export class GoogleAuthRepository extends Repository<GoogleAuth> {}
