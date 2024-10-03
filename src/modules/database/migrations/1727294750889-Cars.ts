import { MigrationInterface, QueryRunner } from 'typeorm';

export class Cars1727294750889 implements MigrationInterface {
  name = 'Cars1727294750889';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "car" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "model" character varying NOT NULL, "location" geography(Point,4326) NOT NULL, "mileage" integer NOT NULL, "year" integer NOT NULL, "color" character varying NOT NULL, CONSTRAINT "PK_55bbdeb14e0b1d7ab417d11ee6d" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "car"`);
  }
}
