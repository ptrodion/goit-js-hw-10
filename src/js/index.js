import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import SlimSelect from 'slim-select';

import 'slim-select/dist/slimselect.css';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const refs = {
  wrapperEL: document.querySelector('.wrapper'),
  selectEL: document.querySelector('.breed-select'),
  loaderEl: document.querySelector('.loader'),
  catsEl: document.querySelector('.cat-info'),
};

function showElements(select = true, loader = false, wrapper = false) {
  refs.selectEL.hidden = select;
  refs.loaderEl.style.display = loader ? 'none' : 'block';
  refs.wrapperEL.hidden = wrapper;
}
showElements();

let datesCates = [];

document.addEventListener('DOMContentLoaded', loadingPage);
refs.selectEL.addEventListener('change', handlerSelectInput);

// START --__ Fetch list for server
function loadingPage() {
  let timeInterval = setInterval(() => {
    fetchBreeds()
      .then(data => {
        clearInterval(timeInterval);
        showElements(false, true, false);
        datesCates = [...data];

        refs.selectEL.innerHTML = createMarkupSelect(datesCates);
        initializationSlimSelect();
      })
      .catch(err => {
        showElements(true, true, true);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Something went wrong! ${err.message}! Try reloading the page!`,
          footer: '<a href="./index.js">Do you want to try again?</a>',
        });
        clearInterval(timeInterval);
      });
  }, 1000);
}

function createMarkupSelect(arr) {
  return arr
    .map(({ name, id }) => `<option value=${id}>${name}</option>`)
    .join('');
}

function initializationSlimSelect() {
  new SlimSelect({
    select: refs.selectEL,
  });
}
// END --__ Fetch list for server

// START --__ Fetch elements for server
function handlerSelectInput(e) {
  showElements(true, false, false);

  const idCat = e.target.value;

  let timeInterval = setInterval(() => {
    fetchCatByBreed(idCat)
      .then(url => {
        clearInterval(timeInterval);
        showElements(false, true, false);
        refs.catsEl.innerHTML = createMarkupCat(idCat, url);
      })
      .catch(err => {
        showElements(true, true, true);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Something went wrong! ${err.message}! Try reloading the page!`,
          footer: '<a href="./index.js">Do you want to try again?</a>',
        });
        clearInterval(timeInterval);
      });
  }, 1000);
}

function createMarkupCat(idCat, url) {
  const selectedElement = datesCates.find(elem => elem.id === idCat);

  const { name, description, temperament } = selectedElement;

  return `<img src="${url}" alt="${name}" class="cat-info-element" max-width="300" >
    <h1 class="cat-info-title">${name}</h1>
    <p class="class=cat-info-description">${description}</p>
    <p class="class=cat-info-description"> <span class=cat-info-temperament >Temperament:</span> ${temperament}</p>`;
}
