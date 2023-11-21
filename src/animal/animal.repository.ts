import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Animal } from './entities/animal.entity';
import { Exceptions } from 'src/utils/exceptions/exceptionsHelper';
import { Exception } from 'src/utils/exceptions/exception';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { AnimalStatus, AnimalUser } from '@prisma/client';
import { parse, isValid, startOfDay, endOfDay } from 'date-fns';
import { DogApi } from 'src/utils/API/service/DogApi.service';
import { CatApi } from 'src/utils/API/service/CatApi.service';

@Injectable()
export class AnimalRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dogApiService: DogApi,
    private readonly catApiService: CatApi,
  ) {}

  async createAnimal(animal: Animal, userId: string): Promise<Animal> {
    try {
      const createdAnimal = await this.prisma.animal.create({ data: animal });
      await this.prisma.animalUser.create({
        data: {
          userId: userId,
          animalId: createdAnimal.id,
        },
      });
      return createdAnimal;
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException, 'Animal já cadastrado');
    }
  }

  async updateAnimal(userId: string, animal: UpdateAnimalDto): Promise<Animal> {
    try {
      const animalUser = await this.prisma.animalUser.findUnique({
        where: {
          userId_animalId: {
            userId,
            animalId: animal.id,
          },
        },
      });

      if (!animalUser) {
        throw new Exception(
          Exceptions.DatabaseException,
          'Usuário não autorizado a atualizar este animal',
        );
      }

      return await this.prisma.animal.update({
        where: { id: animal.id },
        data: animal,
      });
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }

  async deleteAnimal(userId: string, animalId: string): Promise<void> {
    try {
      const animalUser = await this.prisma.animalUser.findUnique({
        where: {
          userId_animalId: {
            userId,
            animalId,
          },
        },
      });

      if (!animalUser) {
        throw new Exception(
          Exceptions.DatabaseException,
          'Usuário não autorizado a deletar este animal',
        );
      }

      await this.prisma.animalUser.delete({
        where: {
          userId_animalId: {
            userId,
            animalId,
          },
        },
      });
      await this.prisma.animal.delete({
        where: { id: animalId },
      });
    } catch (err) {
      throw new Exception(
        Exceptions.DatabaseException,
        'Animal não encontrado ou usuário não autorizado',
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

  async findAllAnimalsByUser(userId: string): Promise<Animal[]> {
    try {
      const userWithAnimals = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          animals: { include: { animal: true } },
        },
      });

      if (!userWithAnimals) {
        throw new Exception(
          Exceptions.DatabaseException,
          'Usuário não encontrado',
        );
      }

      return userWithAnimals.animals.map(({ animal }) => animal);
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
    userId: string,
    animalId: string,
    newStatus: AnimalStatus,
  ): Promise<Animal> {
    try {
      const animalUser = await this.prisma.animalUser.findUnique({
        where: {
          userId_animalId: {
            userId,
            animalId,
          },
        },
      });

      if (!animalUser) {
        throw new Exception(
          Exceptions.DatabaseException,
          'Usuário não autorizado a atualizar o status deste animal',
        );
      }

      return await this.prisma.animal.update({
        where: { id: animalId },
        data: { status: newStatus },
      });
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }

  async findAllAnimalsByTerm(term: string): Promise<Animal[]> {
    try {
      const dogsFromAPI = await this.dogApiService.getDogs();
      const catsFromAPI = await this.catApiService.getCats();

      const filteredDogs = dogsFromAPI.filter((dog) => dog.name.includes(term));
      const filteredCats = catsFromAPI.filter((cat) => cat.name.includes(term));

      const animalsFromDatabase = await this.prisma.animal.findMany({
        where: {
          OR: [
            { name: { contains: term } },
            { description: { contains: term } },
          ],
        },
      });

      const allAnimals = [
        ...animalsFromDatabase,
        ...filteredDogs,
        ...filteredCats,
      ];

      return allAnimals;
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }

  async findAllAnimalsByCategory(category: string): Promise<Animal[]> {
    try {
      const animalsFromDatabase = await this.prisma.animal.findMany({
        where: { category },
      });

      const dogsFromAPI = await this.dogApiService.searchDogsByCategory(
        category,
      );
      const catsFromAPI = await this.catApiService.searchCatsByCategory(
        category,
      );

      const allAnimals = [
        ...animalsFromDatabase,
        ...dogsFromAPI,
        ...catsFromAPI,
      ];

      return allAnimals;
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }

  async findAllAnimalsByStatus(status: AnimalStatus): Promise<Animal[]> {
    try {
      const animalsFromDatabase = await this.prisma.animal.findMany({
        where: { status },
      });

      const dogsFromAPI = await this.dogApiService.searchDogsByStatus(status);
      const catsFromAPI = await this.catApiService.searchCatsByStatus(status);

      const allAnimals = [
        ...animalsFromDatabase,
        ...dogsFromAPI,
        ...catsFromAPI,
      ];

      return allAnimals;
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }

  private parseDate(dateString: string, format: string): Date | null {
    const parsedDate = parse(dateString, format, new Date());
    return isValid(parsedDate) ? parsedDate : null;
  }

  async findAllAnimalsByCreationDate(
    creationDateInput: string,
  ): Promise<Animal[]> {
    try {
      const parsedDate =
        this.parseDate(creationDateInput, 'yyyy/MM/dd') ||
        this.parseDate(creationDateInput, 'dd/MM/yyyy');

      const { gte, lte } = {
        gte: startOfDay(parsedDate),
        lte: endOfDay(parsedDate),
      };

      const animalsFromDatabase = await this.prisma.animal.findMany({
        where: { creationDate: { gte, lte } },
      });

      const dogsFromAPI = await this.dogApiService.searchDogsByCreationDate(
        parsedDate,
      );
      const catsFromAPI = await this.catApiService.searchCatsByCreationDate(
        parsedDate,
      );

      const allAnimals = [
        ...animalsFromDatabase,
        ...dogsFromAPI,
        ...catsFromAPI,
      ];

      return allAnimals;
    } catch (err) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }

  async findAllDogsFromExternalAPI(): Promise<any[]> {
    try {
      const dogData = await this.dogApiService.getDogs();

      return dogData;
    } catch (err) {
      throw new Exception(
        Exceptions.DatabaseException,
        'Falha ao buscar dados do cachorro',
      );
    }
  }

  async findAllCatsFromExternalAPI(): Promise<any[]> {
    try {
      const catData = await this.catApiService.getCats();

      return catData;
    } catch (err) {
      throw new Exception(
        Exceptions.DatabaseException,
        'Falha ao buscar dados do gato',
      );
    }
  }

  async findAllAnimalsIncludingExternalData(): Promise<Animal[]> {
    try {
      const animalsFromDatabase = await this.prisma.animal.findMany();
      const dogsFromAPI = await this.findAllDogsFromExternalAPI();
      const catsFromAPI = await this.findAllCatsFromExternalAPI();
      const allAnimals = [
        ...animalsFromDatabase,
        ...dogsFromAPI,
        ...catsFromAPI,
      ];

      return allAnimals;
    } catch (error) {
      throw new Exception(Exceptions.DatabaseException);
    }
  }
}
