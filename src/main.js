import FilterPresenter from "./presenter/filter.js";
import Menu from './view/menu';
import FilmSectionPresenter from './presenter/film-section';
import FilmsModel from './model/films';
import FilterModel from "./model/filter.js";
import Api from "./api/index.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";
import {
  render,
} from './utils/render';
import {
  UpdateType,
  BackendValues
} from './const';

const STORE_PREFIX = `cinema-localstorage`;
const STORE_VER = `v12`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const main = document.querySelector(`.main`);

const api = new Api(BackendValues.END_POINT, BackendValues.AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filmsModel = new FilmsModel();

const menu = new Menu();
render(main, menu);

const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(menu, filterModel, filmsModel);
const filmSectionPresenter = new FilmSectionPresenter(main, filmsModel, filterModel, apiWithProvider);

filterPresenter.init();
filmSectionPresenter.init();

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    menu.getElement().style.display = ``;
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    menu.getElement().style.display = ``;
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      // console.log(`ServiceWorker available`); // eslint-disable-line no-console
    }).catch(() => {
      // console.error(`ServiceWorker isn't available`); // eslint-disable-line no-console
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
