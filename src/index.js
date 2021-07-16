import './sass/main.scss';
import ImagesApiService from './js/apiService.js';
import imagesListTpl from './templates/imagesListTpl.hbs';
import { error, notice } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";


const refs = {
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader-js'),
  form: document.querySelector('#search-form'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};

const imagesApiService = new ImagesApiService(); 

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch (evt) {
    evt.preventDefault();

    try {
        imagesApiService.query = evt.currentTarget.elements.query.value;
        evt.currentTarget.elements.query.value = '';

        if(imagesApiService.query === '') {
            return error({
              text: 'Try entering something else',
              delay: 3000,
              mouseReset: true,
            });
        };

        imagesApiService.resetPage();
        refs.loader.classList.remove('is-hidden');
        const images = await imagesApiService.fetchImages();
        
        checkImagesPresence(images);
        clearGalleryContainer(images);
        insertImagesMarkup(images);
        scrollAfterLoad();

        refs.loader.classList.add('is-hidden');
    } catch {
        return error({
          text: 'Error sorry',
          delay: 3000,
          mouseReset: true,
        });
    };  
};

async function onLoadMore () {
    refs.loader.classList.remove('is-hidden');
    const images = await imagesApiService.fetchImages();
    insertImagesMarkup(images);    
    refs.loader.classList.add('is-hidden');
    scrollAfterLoad();
};

function insertImagesMarkup (images) {
    refs.gallery.insertAdjacentHTML('beforeend', imagesListTpl(images));
    refs.loadMoreBtn.classList.remove('is-hidden');
};

function clearGalleryContainer () {
    refs.gallery.innerHTML = '';
};

function scrollAfterLoad() {
  refs.loadMoreBtn.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}

function checkImagesPresence (array) {
    if (array.length === 0) {
        return notice({
          text: 'Try entering something else',
          delay: 3000,
        });
    }
};





