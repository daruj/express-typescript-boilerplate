import * as bcrypt from 'bcrypt'

import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm'

import { Exclude } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { User } from './User'

@Entity('local_auth')
export class LocalAuth {
    public static hashPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return reject(err)
                }
                resolve(hash)
            })
        })
    }

    public static comparePassword(
        localAuth: LocalAuth,
        password: string
    ): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, localAuth.password, (err, res) => {
                resolve(res === true)
            })
        })
    }

    @PrimaryColumn()
    public email: string

    @OneToOne(type => User, user => user.id)
    @JoinColumn({ name: 'user_id' })
    user: User

    @IsNotEmpty()
    @Column()
    @Exclude()
    public password: string

    @BeforeInsert()
    public async hashPassword(): Promise<void> {
        this.password = await LocalAuth.hashPassword(this.password)
    }

    @CreateDateColumn({ type: 'timestamp' })
    public created_at: Date

    @UpdateDateColumn({ type: 'timestamp' })
    public updated_at: Date
}
