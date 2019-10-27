import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm'

export class AddUserRelationToRoleTable1571163380050
    implements MigrationInterface {
    private userRoleFk = new TableForeignKey({
        name: 'fk_user_role',
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'NO ACTION'
    })

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createForeignKey('users', this.userRoleFk)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('users', this.userRoleFk)
    }
}
