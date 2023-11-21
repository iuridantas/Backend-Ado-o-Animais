import { Injectable } from '@nestjs/common';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { AnimalRepository } from './animal.repository';
import { randomUUID } from 'node:crypto';
import { Animal } from './entities/animal.entity';
import { AnimalStatus } from '@prisma/client';

@Injectable()
export class AnimalService {
  constructor(private readonly animalRepository: AnimalRepository) {}

  async create(
    createAnimalDto: CreateAnimalDto,
    userId: string,
  ): Promise<Animal> {
    const id = randomUUID();
    return await this.animalRepository.createAnimal(
      { ...createAnimalDto, id },
      userId,
    );
  }

  async findAll(): Promise<Animal[]> {
    return await this.animalRepository.findAllAnimals();
  }

  async findAllByUser(id: string): Promise<Animal[]> {
    return await this.animalRepository.findAllAnimalsByUser(id);
  }

  async findOne(id: string): Promise<Animal> {
    return await this.animalRepository.findAnimalById(id);
  }

  async update(
    userId: string,
    updateAnimalDto: UpdateAnimalDto,
  ): Promise<Animal> {
    return await this.animalRepository.updateAnimal(userId, updateAnimalDto);
  }

  async remove(userId: string, id: string): Promise<string> {
    await this.animalRepository.deleteAnimal(userId, id);
    return 'Animal excluído com sucesso';
  }

  async updateStatus(
    userId: string,
    id: string,
    newStatus: AnimalStatus,
  ): Promise<Animal> {
    return await this.animalRepository.updateAnimalStatus(
      userId,
      id,
      newStatus,
    );
  }

  async findAllByTerm(term: string): Promise<Animal[]> {
    return await this.animalRepository.findAllAnimalsByTerm(term);
  }

  async findAllByCategory(category: string): Promise<Animal[]> {
    return await this.animalRepository.findAllAnimalsByCategory(category);
  }

  async findAllByStatus(status: AnimalStatus): Promise<Animal[]> {
    return await this.animalRepository.findAllAnimalsByStatus(status);
  }

  async findAllByCreationDate(creationDate: string): Promise<Animal[]> {
    return await this.animalRepository.findAllAnimalsByCreationDate(
      creationDate,
    );
  }

  async findAllDogsFromExternalAPI(): Promise<Animal[]> {
    return await this.animalRepository.findAllDogsFromExternalAPI();
  }

  async findAllCatsFromExternalAPI(): Promise<Animal[]> {
    return await this.animalRepository.findAllCatsFromExternalAPI();
  }

  async findAllAnimalsIncludingExternalData(): Promise<Animal[]> {
    return await this.animalRepository.findAllAnimalsIncludingExternalData();
  }
}
