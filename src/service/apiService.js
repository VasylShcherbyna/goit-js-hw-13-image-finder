const baseUrl =
  'https://pixabay.com/api/?image_type=photo&orientation=horizontal';

export default {
  page: 1,
  query: '',
  perPage: 12,
  key: '14890929-23ffdef91aab059ee79f68fac',
  fetchImages: async function() {
    const requestParams = `&q=${this.query}&page=${this.page}&per_page=${this.perPage}&key=${this.key}`;
    try {
      let response = await fetch(baseUrl + requestParams);
      let parsedResponse = await response.json();
      let hits = await parsedResponse.hits;
      this.incrementPage();
      return hits;
    } catch (err) {
      console.log(err);
    }
  },
  get searchQuery() {
    return this.query;
  },
  set searchQuery(string) {
    this.query = string;
  },
  incrementPage() {
    this.page += 1;
  },
  resetPage() {
    this.page = 1;
  },
};
