import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm'

import { User } from './User'

@Entity('roles')
export class Role {
    @PrimaryColumn('uuid')
    public id: string

    @Column()
    public name: string

    @OneToMany(type => User, user => user.role)
    @JoinColumn({ name: 'user_id' })
    public users: User[]

    @CreateDateColumn({ type: 'timestamp' })
    public created_at: Date

    @UpdateDateColumn({ type: 'timestamp' })
    public updated_at: Date
}
