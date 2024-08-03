-- CreateTable
CREATE TABLE "armies" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "game_system" TEXT NOT NULL,
    "faction" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "armies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "stats" TEXT NOT NULL,
    "gear" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "base_length" TEXT NOT NULL,
    "base_width" TEXT NOT NULL,
    "base_shape_id" INTEGER NOT NULL,
    "army_id" INTEGER NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base_shapes" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "base_shapes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "miniatures" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "stats" TEXT NOT NULL,
    "gear" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "unit_id" INTEGER NOT NULL,

    CONSTRAINT "miniatures_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_base_shape_id_fkey" FOREIGN KEY ("base_shape_id") REFERENCES "base_shapes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_army_id_fkey" FOREIGN KEY ("army_id") REFERENCES "armies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "miniatures" ADD CONSTRAINT "miniatures_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
