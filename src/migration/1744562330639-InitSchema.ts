import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1744562330639 implements MigrationInterface {
    name = 'InitSchema1744562330639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subject" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, CONSTRAINT "UQ_d011c391e37d9a5e63e8b04c977" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "assignment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "studentId" integer, "subjectId" integer)`);
        await queryRunner.query(`CREATE TABLE "grade" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "grade" varchar NOT NULL, "feedback" text NOT NULL, "gradedAt" datetime NOT NULL DEFAULT (datetime('now')), "assignmentId" integer, "studentId" integer, "teacherId" integer)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('STUDENT'), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "temporary_assignment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "studentId" integer, "subjectId" integer, CONSTRAINT "FK_e5df0902162b03354e926ce5bda" FOREIGN KEY ("studentId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1c3cd5ad3d0d1adf3c4873f60fb" FOREIGN KEY ("subjectId") REFERENCES "subject" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_assignment"("id", "title", "content", "createdAt", "studentId", "subjectId") SELECT "id", "title", "content", "createdAt", "studentId", "subjectId" FROM "assignment"`);
        await queryRunner.query(`DROP TABLE "assignment"`);
        await queryRunner.query(`ALTER TABLE "temporary_assignment" RENAME TO "assignment"`);
        await queryRunner.query(`CREATE TABLE "temporary_grade" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "grade" varchar NOT NULL, "feedback" text NOT NULL, "gradedAt" datetime NOT NULL DEFAULT (datetime('now')), "assignmentId" integer, "studentId" integer, "teacherId" integer, CONSTRAINT "FK_88a81bf856632af9c5e762d0985" FOREIGN KEY ("assignmentId") REFERENCES "assignment" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_770cab79ce1d111bc05db17cfbd" FOREIGN KEY ("studentId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_8465191943752aee14abd9988b5" FOREIGN KEY ("teacherId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_grade"("id", "grade", "feedback", "gradedAt", "assignmentId", "studentId", "teacherId") SELECT "id", "grade", "feedback", "gradedAt", "assignmentId", "studentId", "teacherId" FROM "grade"`);
        await queryRunner.query(`DROP TABLE "grade"`);
        await queryRunner.query(`ALTER TABLE "temporary_grade" RENAME TO "grade"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "grade" RENAME TO "temporary_grade"`);
        await queryRunner.query(`CREATE TABLE "grade" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "grade" varchar NOT NULL, "feedback" text NOT NULL, "gradedAt" datetime NOT NULL DEFAULT (datetime('now')), "assignmentId" integer, "studentId" integer, "teacherId" integer)`);
        await queryRunner.query(`INSERT INTO "grade"("id", "grade", "feedback", "gradedAt", "assignmentId", "studentId", "teacherId") SELECT "id", "grade", "feedback", "gradedAt", "assignmentId", "studentId", "teacherId" FROM "temporary_grade"`);
        await queryRunner.query(`DROP TABLE "temporary_grade"`);
        await queryRunner.query(`ALTER TABLE "assignment" RENAME TO "temporary_assignment"`);
        await queryRunner.query(`CREATE TABLE "assignment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "studentId" integer, "subjectId" integer)`);
        await queryRunner.query(`INSERT INTO "assignment"("id", "title", "content", "createdAt", "studentId", "subjectId") SELECT "id", "title", "content", "createdAt", "studentId", "subjectId" FROM "temporary_assignment"`);
        await queryRunner.query(`DROP TABLE "temporary_assignment"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "grade"`);
        await queryRunner.query(`DROP TABLE "assignment"`);
        await queryRunner.query(`DROP TABLE "subject"`);
    }

}
