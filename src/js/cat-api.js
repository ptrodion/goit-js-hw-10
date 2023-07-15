import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_cK5eVLnSrGBmmngczTMu0cNbQDslW9YnXLOvdntREOq3waRUZWSzZjuJ2UgHlfne';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_URL = 'https://api.thecatapi.com/';

const customConfig = {
  baseURL: BASE_URL,
};

const instance = axios.create(customConfig);

export function fetchBreeds() {
  return instance('v1/breeds').then(resp => {
    if (resp.status !== 200) {
      throw new Error(resp.statusText);
    }

    return resp.data;
  });
}

export function fetchCatByBreed(idCat) {
  return instance(`v1/images/search?breed_ids=${idCat}`).then(resp => {
    if (resp.status !== 200) {
      throw new Error(resp.statusText);
    }
    return resp.data[0].url;
  });
}
