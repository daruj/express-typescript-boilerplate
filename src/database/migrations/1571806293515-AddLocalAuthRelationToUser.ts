import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm'

export class AddLocalAuthRelationToUser1571806293515
    implements MigrationInterface {
    private localAuthUserFk = new TableForeignKey({
        name: 'fk_local_auth_user',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'NO ACTION'
    })

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createForeignKey('local_auth', this.localAuthUserFk)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('local_auth', this.localAuthUserFk)
    }
}
