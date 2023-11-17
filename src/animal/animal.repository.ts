import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Animal } from './entities/animal.entity';
import { Exceptions } from 'src/utils/exceptions/exceptionsHelper';
import { Exception } from 'src/utils/exceptions/exception';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { AnimalStatus } from '@prisma/client';
import { parse, isValid, startOfDay, endOfDay } from 'date-fns';
import { DogApi } from 'src/utils/API/partners/dogAPI.service';
import { CatApi } from 'src/utils/API/partners/catAPI.service';


@Injectable()
export class AnimalRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dogApiService: DogApi,
    private readonly catApiService: CatApi,
  ) {}

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
        where: { id },
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
        where: { id },
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
        where: { id },
        data: { status: newStatus },
      });
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }

  async findAllAnimalsByTerm(term: string): Promise<Animal[]> {
    try {
      return await this.prisma.animal.findMany({
        where: {
          OR: [
            { name: { contains: term } },
            { description: { contains: term } },
          ],
        },
      });
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }

  async findAllAnimalsByCategory(category: string): Promise<Animal[]> {
    try {
      return await this.prisma.animal.findMany({
        where: { category },
      });
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }

  async findAllAnimalsByStatus(status: AnimalStatus): Promise<Animal[]> {
    try {
      return await this.prisma.animal.findMany({
        where: { status },
      });
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }

  async findAllAnimalsByCreationDate(
    creationDateInput: string,
  ): Promise<Animal[]> {
    try {
      const parsedDate =
        this.parseDate(creationDateInput, 'yyyy/MM/dd') ||
        this.parseDate(creationDateInput, 'dd/MM/yyyy');

      return await this.findAnimalsByDateRange(parsedDate);
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }

  private parseDate(dateString: string, format: string): Date | null {
    const parsedDate = parse(dateString, format, new Date());
    return isValid(parsedDate) ? parsedDate : null;
  }

  private async findAnimalsByDateRange(creationDate: Date): Promise<Animal[]> {
    const { gte, lte } = {
      gte: startOfDay(creationDate),
      lte: endOfDay(creationDate),
    };

    return await this.prisma.animal.findMany({
      where: { creationDate: { gte, lte } },
    });
  }

  async indexAnimalsFromPartners(): Promise<void> {
    try {
      const dogs = await this.dogApiService.getDogs();
      const cats = await this.catApiService.getCats();

      const animalsToIndex = [...dogs, ...cats];

      for (const animal of animalsToIndex) {
        await this.createAnimal(animal);
      }
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }
}
