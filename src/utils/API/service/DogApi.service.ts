import { Animal } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';

export interface DogApiService {
  getDogs(): Promise<Animal[]>;
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
    }));
  }
}