/**======================= Button mode ======================== */

import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('#search-form');
const inputValue = document.querySelector('[name="searchQuery"]');
const galleryList = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
let page = 1;
let pages = 0;

searchForm.addEventListener('submit', onSubmit);
loadBtn.addEventListener('click', onLoadBtn);

async function fetchPictures(value, page = 1) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '31759838-fd3fe3febd6f4968e453c2988';
  const OPTIONS = 'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';
  try {
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${value}&${OPTIONS}&page=${page}`);
    return response.data;
  } catch (err) {
    return console.log(err);
  }
}

async function onSubmit(evt) {
  evt.preventDefault();
  galleryList.innerHTML = '';
  page = 1;
  loadBtn.setAttribute('hidden', true);
  try {
    const data = await fetchPictures(inputValue.value);
    const images = data.totalHits;
    pages = Math.ceil(images / 40);
    if (!images) {
      throw new Error();
    } else {
      createMurkup(data);
      Notiflix.Notify.success(`Hooray! We found ${images} images.`);
      if (pages > 1) {
        loadBtn.removeAttribute('hidden');
      }
    }
  } catch {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
  }
}

function createMurkup(data) {
  data.hits.map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
    const murkup = `
      <a href="${largeImageURL}">
        <div class="photo-card">
          <img
            src="${webformatURL}"
            alt="${tags}"
            width="340px"
            height="220px"
          />
          <div class="info">
            <p class="info-item"><b>Likes</b>${likes}</p>
            <p class="info-item"><b>Views</b>${views}</p>
            <p class="info-item"><b>Comments</b>${comments}</p>
            <p class="info-item"><b>Downloads</b>${downloads}</p>
          </div>
        </div>
      </a>
      `;
    galleryList.insertAdjacentHTML('beforeend', murkup);
  }).join('');
  new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });
  return;
}

function onLoadBtn() {
  page += 1;
  if (page === pages) {
    loadBtn.setAttribute('hidden', true);
    Notiflix.Notify.failure('We\'re sorry, but you\'ve reached the end of search results.');
  }
  fetchPictures(inputValue.value, page).then(data => {
    createMurkup(data);
  }).catch(err => console.log(err));
}

/**======================= Scroll mode ======================== */

// import './css/styles.css';
// import axios from 'axios';
// import Notiflix from 'notiflix';
// import SimpleLightbox from 'simplelightbox';
// import "simplelightbox/dist/simple-lightbox.min.css";

// const searchForm = document.querySelector('#search-form');
// const inputValue = document.querySelector('[name="searchQuery"]');
// const galleryList = document.querySelector('.gallery');
// const marker = document.querySelector('.js-marker');

// searchForm.addEventListener('submit', onSubmit);

// const options = {
//   root: null,
//   rootMargin: '200px',
//   threshold: 1.0
// }
// const observer = new IntersectionObserver(onLoad, options);
// let page = 1;
// let pages = 0;

// async function fetchPictures(value, page = 1) {
//   const BASE_URL = 'https://pixabay.com/api/';
//   const API_KEY = '31759838-fd3fe3febd6f4968e453c2988';
//   const OPTIONS = 'image_type=photo&orientation=horizontal&safesearch=true&per_page=40';
//   try {
//     const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${value}&${OPTIONS}&page=${page}`);
//     return response.data;
//   } catch (err) {
//     return console.log(err);
//   }
// }

// async function onSubmit(evt) {
//   evt.preventDefault();
//   observer.unobserve(marker);
//   galleryList.innerHTML = '';
//   page = 1;
//   try {
//     const data = await fetchPictures(inputValue.value);
//     const images = data.totalHits;
//     pages = Math.ceil(images / 40);
//     if (!images) {
//       throw new Error();
//     } else {
//       createMurkup(data);
//       Notiflix.Notify.success(`Hooray! We found ${images} images.`);
//       if (pages > 1) {
//         observer.observe(marker);
//       }
//     }
//   } catch {
//     Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
//   }
// }

// function onLoad(entries, observer) {
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       page += 1;
//       if (page === pages) {
//         observer.unobserve(marker);
//         Notiflix.Notify.failure('We\'re sorry, but you\'ve reached the end of search results.');
//       }
//       fetchPictures(inputValue.value, page).then(data => {
//         createMurkup(data);
//       }).catch(err => console.log(err));
//     }
//   });
// }

// function createMurkup(data) {
//   data.hits.map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
//     const murkup = `
//       <a href="${largeImageURL}">
//         <div class="photo-card">
//           <img
//             src="${webformatURL}"
//             alt="${tags}"
//             width="340px"
//             height="220px"
//           />
//           <div class="info">
//             <p class="info-item"><b>Likes</b>${likes}</p>
//             <p class="info-item"><b>Views</b>${views}</p>
//             <p class="info-item"><b>Comments</b>${comments}</p>
//             <p class="info-item"><b>Downloads</b>${downloads}</p>
//           </div>
//         </div>
//       </a>`;
//     galleryList.insertAdjacentHTML('beforeend', murkup);
//   }).join('');
//   new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });
//   return;
// }