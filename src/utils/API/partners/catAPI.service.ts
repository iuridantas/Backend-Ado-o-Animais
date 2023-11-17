import { Animal } from '@prisma/client';
import axios from 'axios';

export interface CatApiService {
  getCats(): Promise<Animal[]>;
}

export class CatApi implements CatApiService {
  async getCats(): Promise<Animal[]> {
    const response = await axios.get('');
    return response.data.map((cat: any) => ({
      name: cat.name,
      description: cat.description,
      image: cat.image,
      category: cat.category,
      creationDate: cat.creationDate,
      status: cat.status,
    }));
  }
}
