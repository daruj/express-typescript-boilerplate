import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('seeds')
export class Seed {
    @PrimaryGeneratedColumn()
    public id: number

    @Column()
    public seed: string
}
