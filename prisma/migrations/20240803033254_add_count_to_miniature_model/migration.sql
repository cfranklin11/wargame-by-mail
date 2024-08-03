/*
  Warnings:

  - Added the required column `count` to the `miniatures` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "miniatures" ADD COLUMN     "count" INTEGER NOT NULL;
