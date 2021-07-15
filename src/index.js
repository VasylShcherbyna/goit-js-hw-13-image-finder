import './styles.css';
import serviceSearchImages from './service/apiService.js';
import templatesImagesList from './templates/Image.hbs';
import PNotify from '../node_modules/pnotify/dist/es/PNotify.js';
import '../node_modules/pnotify/dist/PNotifyBrightTheme.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  lazyLoad: document.querySelector('.Lazy-Load'),
  linkPixabay: document.querySelector('.link-pixabay'),
};

refs.searchForm.addEventListener('submit', searchImages);
function searchImages(e) {
  e.preventDefault();
  if (e.currentTarget.elements.query.value === '') {
    PNotify.error({
      text: '404 Not found',
    });
  } else {
    if (refs.linkPixabay.className) {
      refs.linkPixabay.classList.add('link-pixabay-hide');
    }
    serviceSearchImages.resetPage();
    clearList();
    const searchValue = e.currentTarget.elements.query.value;
    serviceSearchImages.searchQuery = searchValue;
    observer.observe(refs.lazyLoad);
  }
}
function clearList() {
  refs.gallery.innerHTML = '';
}
// IntersectionObserver
const options = {
  rootMargin: '150px',
  threshold: 0.2,
};
const onEntry = () => {
  insertListImages();
};
const observer = new IntersectionObserver(onEntry, options);

async function insertListImages() {
  try {
    let imagesList = await serviceSearchImages.fetchImages();
    if (imagesList.length !== 0) {
      const markuplist = buildListMarkup(imagesList);
      insertImages(markuplist);
    } else {
      PNotify.error({
        text: `"${serviceSearchImages.query}" not found`,
      });
      observer.disconnect();
    }
  } catch (err) {
    console.log(err);
  }
}
function buildListMarkup(items) {
  return templatesImagesList(items);
}
function insertImages(items) {
  refs.gallery.insertAdjacentHTML('beforeend', items);
}
