/*
  Warnings:

  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Game";

-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terrains" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "angle" DOUBLE PRECISION NOT NULL,
    "center_x" DOUBLE PRECISION NOT NULL,
    "center_y" DOUBLE PRECISION NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "terrain_type_id" INTEGER NOT NULL,
    "terrain_shape_id" INTEGER NOT NULL,

    CONSTRAINT "terrains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terrain_types" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "terrain_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terrain_shapes" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "terrain_shapes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "terrains" ADD CONSTRAINT "terrains_terrain_type_id_fkey" FOREIGN KEY ("terrain_type_id") REFERENCES "terrain_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terrains" ADD CONSTRAINT "terrains_terrain_shape_id_fkey" FOREIGN KEY ("terrain_shape_id") REFERENCES "terrain_shapes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
