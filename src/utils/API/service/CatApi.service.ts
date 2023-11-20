import { Animal } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';

export interface CatApiService {
  getCats(): Promise<Animal[]>;
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
}
