import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm'

export class AddGoogleAuthRelationToUser1571806298567
    implements MigrationInterface {
    private googleAuthUserFk = new TableForeignKey({
        name: 'fk_google_auth_user',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'NO ACTION'
    })

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createForeignKey('google_auth', this.googleAuthUserFk)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('google_auth', this.googleAuthUserFk)
    }
}
