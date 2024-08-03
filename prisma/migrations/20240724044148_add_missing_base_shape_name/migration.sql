/*
  Warnings:

  - Added the required column `name` to the `base_shapes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "base_shapes" ADD COLUMN     "name" TEXT NOT NULL;
