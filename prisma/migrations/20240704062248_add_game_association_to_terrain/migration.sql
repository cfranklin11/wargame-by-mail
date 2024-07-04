/*
  Warnings:

  - Added the required column `game_id` to the `terrains` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "terrains" ADD COLUMN     "game_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "terrains" ADD CONSTRAINT "terrains_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
