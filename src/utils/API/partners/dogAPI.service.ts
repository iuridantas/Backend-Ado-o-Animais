import { Animal } from '@prisma/client';
import axios from 'axios';

export interface DogApiService {
  getDogs(): Promise<Animal[]>;
}

export class DogApi implements DogApiService {
  async getDogs(): Promise<Animal[]> {
    const response = await axios.get('');
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
