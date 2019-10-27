import { MigrationInterface, QueryRunner } from 'typeorm'

export class SeedsTable1511105183651 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            DROP SEQUENCE IF EXISTS seeds_id_seq;
            CREATE SEQUENCE seeds_id_seq;
            CREATE TABLE public.seeds
            (
                id integer NOT NULL DEFAULT nextval('seeds_id_seq'::regclass),
                seed character varying COLLATE pg_catalog."default" NOT NULL,
                CONSTRAINT "PK_seeds" PRIMARY KEY (id)
            )
            WITH (
                OIDS = FALSE
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP SEQUENCE IF EXISTS seeds_id_seq;')
        await queryRunner.dropTable('seeds')
    }
}
