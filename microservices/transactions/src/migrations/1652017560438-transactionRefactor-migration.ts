import { MigrationInterface, QueryRunner } from 'typeorm'

export class transactionRefactorMigration1652017560438
    implements MigrationInterface
{
    name = 'transactionRefactorMigration1652017560438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transactions" DROP COLUMN "walletId"
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transactions"
            ADD "walletId" character varying NOT NULL
        `)
    }
}
