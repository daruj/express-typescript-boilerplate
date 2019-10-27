import { Entity } from 'typeorm'
import { SocialMediaAuth } from './SocialMedialAuth'

@Entity('google_auth')
export class GoogleAuth extends SocialMediaAuth {}
