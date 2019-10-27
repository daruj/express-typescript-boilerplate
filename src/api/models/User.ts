import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm'

import { IsNotEmpty } from 'class-validator'
import { Role } from './Role'

@Entity('users')
export class User {
    @PrimaryColumn('uuid')
    public id: string

    @IsNotEmpty()
    @Column()
    public username: string

    @IsNotEmpty()
    @Column()
    public email: string

    @IsNotEmpty()
    @Column({ name: 'first_name' })
    public firstName: string

    @IsNotEmpty()
    @Column({ name: 'last_name' })
    public lastName: string

    @Column({ name: 'photo_url', nullable: true })
    public photoUrl?: string

    @Column({ name: 'phone_number', nullable: true })
    public phoneNumber?: string

    @ManyToOne(type => Role, role => role.name)
    @JoinColumn({ name: 'role_id' })
    public role: Role

    @IsNotEmpty()
    @Column()
    public active: boolean

    @CreateDateColumn({ type: 'timestamp' })
    public created_at: Date

    @UpdateDateColumn({ type: 'timestamp' })
    public updated_at: Date

    public toString(): string {
        return `${this.firstName} ${this.lastName} (${this.email})`
    }
}
