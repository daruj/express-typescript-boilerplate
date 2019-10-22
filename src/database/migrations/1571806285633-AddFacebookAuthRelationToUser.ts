import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm'

export class AddFacebookAuthRelationToUser1571806285633
    implements MigrationInterface {
    private facebookAuthUserFk = new TableForeignKey({
        name: 'fk_facebook_auth_user',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'NO ACTION'
    })

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createForeignKey(
            'facebook_auth',
            this.facebookAuthUserFk
        )
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey(
            'facebook_auth',
            this.facebookAuthUserFk
        )
    }
}
