import { EventSubscriber, On } from 'event-dispatch'

import { Logger } from '../../lib/logger'
import { Role } from '../models/Role'
import { events } from './events'

const log = new Logger(__filename)

@EventSubscriber()
export class RoleEventSubscriber {
    @On(events.role.findMany)
    public onRoleFindMany(roles: Role[]): void {
        log.info(`Roles found!`)
    }

    @On(events.role.find)
    public onRoleFind(role: Role): void {
        log.info(`Role found!`)
    }

    @On(events.role.created)
    public onRoleCreate(role: Role): void {
        log.info(`Role ${role.toString()} created!`)
    }

    @On(events.role.created)
    public onRoleUpdate(role: Role): void {
        log.info(`Role ${role.toString()} updated!`)
    }

    @On(events.role.removed)
    public onRoleRemoved(roleId: string): void {
        log.info(`Role ${roleId} removed!`)
    }
}
