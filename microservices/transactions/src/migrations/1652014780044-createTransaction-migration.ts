import { MigrationInterface, QueryRunner } from 'typeorm'

export class createTransactionMigration1652014780044
    implements MigrationInterface
{
    name = 'createTransactionMigration1652014780044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."transactions_type_enum" AS ENUM('deposit', 'withdraw', 'transaction')
        `)
        await queryRunner.query(`
            CREATE TABLE "transactions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "walletId" character varying NOT NULL,
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
        await queryRunner.query(`
            DROP TYPE "public"."transactions_type_enum"
        `)
    }
}
