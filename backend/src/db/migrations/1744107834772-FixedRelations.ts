import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedRelations1744107834772 implements MigrationInterface {
    name = 'FixedRelations1744107834772'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings"."booking" ADD "tableId" integer`);
        await queryRunner.query(`ALTER TABLE "bookings"."booking" ADD CONSTRAINT "FK_c7d32a3c5c0a2a6649afd7f7f47" FOREIGN KEY ("tableId") REFERENCES "restaurants"."table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings"."booking" DROP CONSTRAINT "FK_c7d32a3c5c0a2a6649afd7f7f47"`);
        await queryRunner.query(`ALTER TABLE "bookings"."booking" DROP COLUMN "tableId"`);
    }

}
