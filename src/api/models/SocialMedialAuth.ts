import {
    Column,
    CreateDateColumn,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm'

import { IsNotEmpty } from 'class-validator'
import { User } from './User'

export class SocialMediaAuth {
    @PrimaryColumn()
    public email: string

    @Column()
    @IsNotEmpty()
    public accountId: string

    @OneToOne(type => User, user => user.id)
    @JoinColumn({ name: 'user_id' })
    user: User

    @CreateDateColumn({ type: 'timestamp' })
    public created_at: Date

    @UpdateDateColumn({ type: 'timestamp' })
    public updated_at: Date
}
