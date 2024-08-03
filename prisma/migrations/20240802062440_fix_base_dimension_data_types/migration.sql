/*
  Warnings:

  - Changed the type of `base_length` on the `units` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `base_width` on the `units` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "units" DROP COLUMN "base_length",
ADD COLUMN     "base_length" INTEGER NOT NULL,
DROP COLUMN "base_width",
ADD COLUMN     "base_width" INTEGER NOT NULL;
