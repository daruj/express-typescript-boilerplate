import { Entity } from 'typeorm'
import { SocialMediaAuth } from './SocialMedialAuth'

@Entity('facebook_auth')
export class FacebookAuth extends SocialMediaAuth {}
