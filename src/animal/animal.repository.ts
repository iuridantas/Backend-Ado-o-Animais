import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Animal } from './entities/animal.entity';
import { Exceptions } from 'src/utils/exceptions/exceptionsHelper';
import { Exception } from 'src/utils/exceptions/exception';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { AnimalStatus } from '@prisma/client';

@Injectable()
export class AnimalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAnimal(animal: Animal): Promise<Animal> {
    try {
      return await this.prisma.animal.create({ data: animal });
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException, 'Animal já cadastrado');
    }
  }

  async updateAnimal(animal: UpdateAnimalDto): Promise<Animal> {
    try {
      return await this.prisma.animal.update({
        where: { id: animal.id },
        data: animal,
      });
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }

  async deleteAnimal(id: string): Promise<Animal> {
    try {
      return await this.prisma.animal.delete({
        where: { id: id },
      });
    } catch (err) {
      throw new Exception(
        Exceptions.DatabaseException,
        'Animal não encontrado',
      );
    }
  }

  async findAllAnimals(): Promise<Animal[]> {
    try {
      return await this.prisma.animal.findMany();
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }

  async findAnimalById(id: string): Promise<Animal> {
    try {
      return await this.prisma.animal.findUniqueOrThrow({
        where: { id: id },
      });
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }

  async updateAnimalStatus(
    id: string,
    newStatus: AnimalStatus,
  ): Promise<Animal> {
    try {
      return await this.prisma.animal.update({
        where: { id: id },
        data: { status: newStatus },
      });
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }
}
