import {MigrationInterface, QueryRunner} from "typeorm";

export class createVotesTable1612378562191 implements MigrationInterface {
    name = 'createVotesTable1612378562191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "votes" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "value" integer NOT NULL, "userName" character varying NOT NULL, "postId" integer, "commentId" integer, CONSTRAINT "PK_f3d9fd4a0af865152c3f59db8ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_8795443b6d3d1ace23075a7cf37"`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "userName" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "posts"."userName" IS NULL`);
        await queryRunner.query(`ALTER TABLE "votes" ADD CONSTRAINT "FK_7cc4be8563ac5eabf0709f4ebcb" FOREIGN KEY ("userName") REFERENCES "users"("userName") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "votes" ADD CONSTRAINT "FK_b5b05adc89dda0614276a13a599" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "votes" ADD CONSTRAINT "FK_554879cbc33538bf15d6991f400" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_8795443b6d3d1ace23075a7cf37" FOREIGN KEY ("userName") REFERENCES "users"("userName") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_8795443b6d3d1ace23075a7cf37"`);
        await queryRunner.query(`ALTER TABLE "votes" DROP CONSTRAINT "FK_554879cbc33538bf15d6991f400"`);
        await queryRunner.query(`ALTER TABLE "votes" DROP CONSTRAINT "FK_b5b05adc89dda0614276a13a599"`);
        await queryRunner.query(`ALTER TABLE "votes" DROP CONSTRAINT "FK_7cc4be8563ac5eabf0709f4ebcb"`);
        await queryRunner.query(`COMMENT ON COLUMN "posts"."userName" IS NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "userName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_8795443b6d3d1ace23075a7cf37" FOREIGN KEY ("userName") REFERENCES "users"("userName") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "votes"`);
    }

}
