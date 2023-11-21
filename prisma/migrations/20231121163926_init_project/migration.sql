/*
  Warnings:

  - The values [AVAILABLE,ADOPTED] on the enum `Animal_status` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `userId` to the `Animal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Animal` ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('available', 'adopted') NOT NULL;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `creationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_id_key`(`id`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnimalUser` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `animalId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AnimalUser_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AnimalUser` ADD CONSTRAINT `AnimalUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnimalUser` ADD CONSTRAINT `AnimalUser_animalId_fkey` FOREIGN KEY (`animalId`) REFERENCES `Animal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
