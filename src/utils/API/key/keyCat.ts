import { CatApi } from '../service/CatApi.service';

const apiKey = process.env.CAT_API_KEY;
const catApi = new CatApi(apiKey);

async function fetchCats() {
  const cats = await catApi.getCats();
}

fetchCats();
