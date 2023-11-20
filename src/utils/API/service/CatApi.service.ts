import { $Enums, Animal, AnimalStatus } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';

export interface CatApiService {
  getCats(): Promise<Animal[]>;
  searchCatsByTerm(term: string): Promise<Animal[]>;
  searchCatsByCategory(category: string): Promise<Animal[]>;
  searchCatsByStatus(status: AnimalStatus): Promise<Animal[]>;
  searchCatsByCreationDate(creationDate: Date): Promise<Animal[]>;
}

export class CatApi implements CatApiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCats(): Promise<Animal[]> {
    const url = 'https://api.thecatapi.com/v1/breeds';

    const response: AxiosResponse<any[]> = await axios.get(url, {
      headers: {
        'x-api-key': this.apiKey,
      },
    });

    return response.data.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      image: cat.image,
      category: cat.category,
      creationDate: cat.creationDate,
      status: cat.status,
    }));
  }

  async searchCatsByTerm(term: string): Promise<Animal[]> {
    const allCats = await this.getCats();

    return allCats.filter(
      (cat) => cat.name.includes(term) || cat.description.includes(term),
    );
  }

  async searchCatsByCategory(category: string): Promise<Animal[]> {
    const allCats = await this.getCats();

    return allCats.filter((cat) => cat.category === category);
  }

  async searchCatsByStatus(status: AnimalStatus): Promise<Animal[]> {
    const allCats = await this.getCats();

    return allCats.filter((cat) => cat.status === status);
  }

  async searchCatsByCreationDate(creationDate: Date): Promise<Animal[]> {
    const allCats = await this.getCats();

    return allCats.filter((cat) => {
      const catCreationDate = new Date(cat.creationDate);
      return catCreationDate.getTime() === creationDate.getTime();
    });
  }
}
