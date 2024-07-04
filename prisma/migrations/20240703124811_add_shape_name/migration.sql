/*
  Warnings:

  - Added the required column `name` to the `terrain_shapes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "terrain_shapes" ADD COLUMN     "name" TEXT NOT NULL;
