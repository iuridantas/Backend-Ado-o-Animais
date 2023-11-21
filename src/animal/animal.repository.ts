import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Animal } from './entities/animal.entity';
import { Exceptions } from 'src/utils/exceptions/exceptionsHelper';
import { Exception } from 'src/utils/exceptions/exception';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { AnimalStatus } from '@prisma/client';
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

    const dogsFromAPI = await this.dogApiService.searchDogsByCategory(category);
    const catsFromAPI = await this.catApiService.searchCatsByCategory(category);

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

  async findAllAnimalsByCreationDate(creationDateInput: string): Promise<Animal[]> {
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
  
      const dogsFromAPI = await this.dogApiService.searchDogsByCreationDate(parsedDate);
      const catsFromAPI = await this.catApiService.searchCatsByCreationDate(parsedDate);
  
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
