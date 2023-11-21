import { Animal, AnimalStatus } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';

export interface DogApiService {
  getDogs(): Promise<Animal[]>;
  searchDogsByTerm(term: string): Promise<Animal[]>;
  searchDogsByCategory(category: string): Promise<Animal[]>;
  searchDogsByStatus(status: AnimalStatus): Promise<Animal[]>;
  searchDogsByCreationDate(creationDate: Date): Promise<Animal[]>;
}

export class DogApi implements DogApiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getDogs(): Promise<Animal[]> {
    const url = 'https://api.thedogapi.com/v1/breeds';

    const response: AxiosResponse<any[]> = await axios.get(url, {
      headers: {
        'x-api-key': this.apiKey,
      },
    });

    return response.data.map((dog: any) => ({
      id: dog.id,
      name: dog.name,
      description: dog.description,
      image: dog.image,
      category: dog.category,
      creationDate: dog.creationDate,
      status: dog.status,
      userId: dog.userId,
    }));
  }

  async searchDogsByTerm(term: string): Promise<Animal[]> {
    const allDogs = await this.getDogs();

    return allDogs.filter(
      (dog) => dog.name.includes(term) || dog.description.includes(term),
    );
  }

  async searchDogsByCategory(category: string): Promise<Animal[]> {
    const allDogs = await this.getDogs();

    return allDogs.filter((dog) => dog.category === category);
  }

  async searchDogsByStatus(status: AnimalStatus): Promise<Animal[]> {
    const allDogs = await this.getDogs();

    return allDogs.filter((dog) => dog.status === status);
  }

  async searchDogsByCreationDate(creationDate: Date): Promise<Animal[]> {
    const allDogs = await this.getDogs();

    return allDogs.filter((dog) => {
      const dogCreationDate = new Date(dog.creationDate);
      return dogCreationDate.getTime() === creationDate.getTime();
    });
  }
}
