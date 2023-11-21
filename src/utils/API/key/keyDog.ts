import { DogApi } from '../service/DogApi.service';

const apiKey = process.env.DOG_API_KEY;
const dogApi = new DogApi(apiKey);

async function fetchDogs() {
  const dogs = await dogApi.getDogs();
}

fetchDogs();
