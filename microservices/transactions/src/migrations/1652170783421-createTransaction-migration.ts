import { MigrationInterface, QueryRunner } from 'typeorm'

export class createTransactionMigration1652170783421
    implements MigrationInterface
{
    name = 'createTransactionMigration1652170783421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "transactions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "money" double precision NOT NULL,
                "type" "public"."transactions_type_enum" NOT NULL,
                "fromWalletId" character varying,
                "toWalletId" character varying NOT NULL,
                CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id")
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "transactions"
        `)
    }
}
