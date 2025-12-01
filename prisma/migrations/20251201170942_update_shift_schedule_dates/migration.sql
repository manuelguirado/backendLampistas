/*
  Warnings:

  - You are about to drop the column `shiftSchedule` on the `ShiftSchedule` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `ShiftSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `ShiftSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- Primero, agregar las columnas con valores por defecto temporales
ALTER TABLE "ShiftSchedule" ADD COLUMN "startDate" TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE "ShiftSchedule" ADD COLUMN "endDate" TIMESTAMP NOT NULL DEFAULT NOW();

-- Copiar el valor de shiftSchedule a startDate (para preservar datos existentes)
UPDATE "ShiftSchedule" SET "startDate" = "shiftSchedule";

-- Poner endDate = startDate + 8 horas (turno de 8 horas por defecto)
UPDATE "ShiftSchedule" SET "endDate" = "startDate" + INTERVAL '8 hours';

-- Ahora eliminar la columna antigua
ALTER TABLE "ShiftSchedule" DROP COLUMN "shiftSchedule";

-- Opcional: Remover los valores por defecto ahora que ya tenemos datos
ALTER TABLE "ShiftSchedule" ALTER COLUMN "startDate" DROP DEFAULT;
ALTER TABLE "ShiftSchedule" ALTER COLUMN "endDate" DROP DEFAULT;
