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

  async create(createAnimalDto: CreateAnimalDto): Promise<Animal> {
    const id = randomUUID();
    return await this.animalRepository.createAnimal({ ...createAnimalDto, id });
  }

  async findAll(): Promise<Animal[]> {
    return await this.animalRepository.findAllAnimals();
  }

  async findOne(id: string): Promise<Animal> {
    return await this.animalRepository.findAnimalById(id);
  }

  async update(updateAnimalDto: UpdateAnimalDto): Promise<Animal> {
    return await this.animalRepository.updateAnimal(updateAnimalDto);
  }

  async remove(id: string): Promise<string> {
    await this.animalRepository.deleteAnimal(id);
    return 'Animal excluido com sucesso';
  }

  async updateStatus(id: string, newStatus: AnimalStatus): Promise<Animal> {
    return await this.animalRepository.updateAnimalStatus(id, newStatus);
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

  async indexAnimalsFromPartners(): Promise<void> {
    return await this.animalRepository.indexAnimalsFromPartners();
  }
}
