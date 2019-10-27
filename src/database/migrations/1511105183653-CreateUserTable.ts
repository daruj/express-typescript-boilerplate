import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateUserTable1511105183653 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isNullable: false,
                    isUnique: true
                },
                {
                    name: 'first_name',
                    type: 'varchar',
                    length: '255',
                    isPrimary: false,
                    isNullable: false
                },
                {
                    name: 'last_name',
                    type: 'varchar',
                    length: '255',
                    isPrimary: false,
                    isNullable: false
                },
                {
                    name: 'email',
                    type: 'varchar',
                    length: '255',
                    isPrimary: false,
                    isNullable: false,
                    isUnique: true
                },
                {
                    name: 'username',
                    type: 'varchar',
                    length: '255',
                    isPrimary: false,
                    isNullable: false,
                    isUnique: true
                },
                {
                    name: 'role_id',
                    type: 'uuid',
                    isPrimary: false,
                    isNullable: false
                },
                {
                    name: 'active',
                    type: 'boolean',
                    isPrimary: false,
                    isNullable: false,
                    default: false
                },
                {
                    name: 'photo_url',
                    type: 'varchar',
                    length: '255',
                    isPrimary: false,
                    isNullable: true
                },
                {
                    name: 'phone_number',
                    type: 'varchar',
                    length: '255',
                    isPrimary: false,
                    isNullable: true
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
        await queryRunner.dropTable('users')
    }
}
