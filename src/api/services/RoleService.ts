import { Service } from 'typedi'
import { OrmRepository } from 'typeorm-typedi-extensions'
import uuid from 'uuid'
import { Role } from '../models/Role'
import { RoleRepository } from '../repositories/RoleRepository'
import { Logger, LoggerInterface } from '../../decorators/Logger'
import { events } from '../subscribers/events'
import { Logged, Sources } from '../../decorators/Logged'
import {
    EventDispatcher,
    EventDispatcherInterface
} from '../../decorators/EventDispatcher'

type findCriteria =
    | {
          name: string
      }
    | { id: string }

@Service()
@Logged(__filename, { source: Sources.DB })
export class RoleService {
    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @OrmRepository() private roleRepository: RoleRepository
    ) {}

    public async findAll(): Promise<Role[]> {
        this.log.info('Find All Roles')
        const roles = await this.roleRepository.find()
        this.eventDispatcher.dispatch(events.role.findMany, roles)
        return roles
    }

    public async findByNameInsensitive(
        name: string
    ): Promise<Role | undefined> {
        this.log.info('Find one role by insensitive name')
        const role = await this.roleRepository.findOneInsensitive(name)
        this.eventDispatcher.dispatch(events.role.find, role)
        return role
    }

    public async findOne(where: findCriteria): Promise<Role | undefined> {
        this.log.info('Find one role')
        const role = await this.roleRepository.findOne(where)
        this.eventDispatcher.dispatch(events.role.find, role)
        return role
    }

    public async create(role: Role): Promise<Role> {
        this.log.info('Create a new role => ', role.toString())
        role.id = uuid.v4()
        const newRole = await this.roleRepository.save(role)
        this.eventDispatcher.dispatch(events.role.created, role)
        return newRole
    }

    public async update(id: string, role: Role): Promise<Role> {
        this.log.info(`Update a role id ${id} =>`, role.toString())
        role.id = id
        const updatedRole = await this.roleRepository.save(role)
        this.eventDispatcher.dispatch(events.role.updated, role)
        return updatedRole
    }

    public async delete(id: string): Promise<void> {
        this.log.info('Delete a role')
        await this.roleRepository.delete(id)
        this.eventDispatcher.dispatch(events.role.removed, id)
        return
    }
}
