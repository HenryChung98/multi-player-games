/*
  Warnings:

  - You are about to alter the column `email` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `password` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(70)`.
  - You are about to alter the column `nickname` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(10)`.
  - A unique constraint covering the columns `[nickname]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `email` VARCHAR(20) NOT NULL,
    MODIFY `password` VARCHAR(70) NOT NULL,
    MODIFY `nickname` VARCHAR(10) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_nickname_key` ON `User`(`nickname`);
