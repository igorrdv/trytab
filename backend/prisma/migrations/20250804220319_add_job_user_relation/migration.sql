/*
  Warnings:

  - You are about to drop the column `company` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Job" DROP COLUMN "company",
ADD COLUMN     "companyId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "remote" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "salary" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'full-time';

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
