import { Service } from 'typedi'
import { OrmRepository } from 'typeorm-typedi-extensions'
import uuid from 'uuid'

import {
    EventDispatcher,
    EventDispatcherInterface
} from '../../decorators/EventDispatcher'
import { Logger, LoggerInterface } from '../../decorators/Logger'
import { User } from '../models/User'
import { UserRepository } from '../repositories/UserRepository'
import { events } from '../subscribers/events'
import { Logged, Sources } from '../../decorators/Logged'

type findCriteria =
    | {
          email: string
      }
    | { username: string }
    | { id: string }

@Service()
@Logged(__filename, { source: Sources.DB })
export class UserService {
    constructor(
        @OrmRepository() private userRepository: UserRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface
    ) {}

    public async find(): Promise<User[]> {
        this.log.info('Find all users')
        const relations = { relations: ['role'] }
        const users = await this.userRepository.find(relations)
        this.eventDispatcher.dispatch(events.user.findMany, users)
        return users
    }

    public async findAllByRoleId(roleId: string): Promise<User[]> {
        this.log.info('Find all users by role Id')
        const users = await this.userRepository.findAllByRoleId(roleId)
        this.eventDispatcher.dispatch(events.user.findMany, users)
        return users
    }

    public async findOne(where: findCriteria): Promise<User | undefined> {
        this.log.info('Find an user')
        const relations = { relations: ['role'] }
        const user = await this.userRepository.findOne(where, relations)
        this.eventDispatcher.dispatch(events.user.find, user)
        return user
    }

    public async create(user: User): Promise<User> {
        this.log.info('Create a new user => ', user.toString())
        user.id = uuid.v4()
        const newUser = await this.userRepository.save(user)
        this.eventDispatcher.dispatch(events.user.created, newUser)
        return newUser
    }

    public async update(id: string, user: User): Promise<User> {
        this.log.info('Update a user')
        user.id = id
        const updatedUser = await this.userRepository.save(user)
        this.eventDispatcher.dispatch(events.user.updated, updatedUser)
        return updatedUser
    }

    public async delete(id: string): Promise<void> {
        this.log.info('Delete a user')
        await this.userRepository.delete(id)
        this.eventDispatcher.dispatch(events.user.removed, id)
        return
    }
}
