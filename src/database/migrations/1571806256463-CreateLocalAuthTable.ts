import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateLocalAuthTable1571806256463 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: 'local_auth',
            columns: [
                {
                    name: 'email',
                    type: 'varchar',
                    isPrimary: true,
                    isNullable: false,
                    isUnique: true
                },
                {
                    name: 'password',
                    type: 'varchar',
                    length: '255',
                    isPrimary: false,
                    isNullable: false
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                    isPrimary: false,
                    isNullable: false
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    length: '255',
                    isPrimary: false,
                    isNullable: false,
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    length: '255',
                    isPrimary: false,
                    isNullable: false,
                    default: 'CURRENT_TIMESTAMP'
                }
            ]
        })
        await queryRunner.createTable(table)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('local_auth')
    }
}
