import { EventSubscriber, On } from 'event-dispatch'

import { Logger } from '../../lib/logger'
import { User } from '../models/User'
import { events } from './events'

const log = new Logger(__filename)

@EventSubscriber()
export class UserEventSubscriber {
    @On(events.user.findMany)
    public onUserFindMany(users: User[]): void {
        log.info(`Users found!`)
    }

    @On(events.user.find)
    public onUserFind(user: User): void {
        log.info(`User found!`)
    }

    @On(events.user.created)
    public onUserCreate(user: User): void {
        log.info(`User ${user.toString()} created!`)
    }

    @On(events.user.created)
    public onUserUpdate(user: User): void {
        log.info(`User ${user.toString()} updated!`)
    }

    @On(events.user.removed)
    public onUserRemoved(userId: string): void {
        log.info(`User ${userId} removed!`)
    }
}
