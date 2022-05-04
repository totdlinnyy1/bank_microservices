import { MigrationInterface, QueryRunner } from 'typeorm'

export class createWalletMigration1651676583580 implements MigrationInterface {
    name = 'createWalletMigration1651676583580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "wallets" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "incoming" double precision NOT NULL DEFAULT '0',
                "outgoing" double precision NOT NULL DEFAULT '0',
                "ownerId" uuid NOT NULL,
                "isClosed" boolean NOT NULL DEFAULT false,
                "isLock" boolean NOT NULL DEFAULT false,
                CONSTRAINT "CHK_4f9cec2d6c638c9b8197718b71" CHECK ("incoming" >= "outgoing"),
                CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id")
            )
        `)
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "deletedAt" TIMESTAMP
        `)
        await queryRunner.query(`
            ALTER TABLE "wallets"
            ADD CONSTRAINT "FK_342cecf691b0d12172e69b2b8f9" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "wallets" DROP CONSTRAINT "FK_342cecf691b0d12172e69b2b8f9"
        `)
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "deletedAt"
        `)
        await queryRunner.query(`
            DROP TABLE "wallets"
        `)
    }
}
