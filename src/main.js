import FilterPresenter from "./presenter/filter.js";
import Menu from './view/menu';
import Stat from './view/stat';
import FilmSectionPresenter from './presenter/film-section';
// import {
//   generateMockFilm
// } from './mock/films';
import {
  render,
} from './utils/render';
import {
  FilmSettings,
  UpdateType
} from './const';
import FilmsModel from './model/films';
import FilterModel from "./model/filter.js";
import Api from "./api.js";

const main = document.querySelector(`.main`);
// const footerStatContainer = document.querySelector(`.footer__statistics`);

// const mockFilmList = new Array(FilmSettings.FILMS_COUNT).fill().map(generateMockFilm);

const AUTHORIZATION = `Basic kTy9g0dsz20171D`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict/`;
const api = new Api(END_POINT, AUTHORIZATION);


const filmsModel = new FilmsModel();
// filmsModel.setFilms(mockFilmList);

// const profile = new Profile(30);
// render(header, profile);

const menu = new Menu();
render(main, menu);

const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(menu, filterModel, filmsModel, api);
const filmSectionPresenter = new FilmSectionPresenter(main, filmsModel, filterModel);

// render(menu, filtersTemplate, RenderPosition.AFTERBEGIN);
filterPresenter.init();
filmSectionPresenter.init();



api.getFilms()
  .then((films) => {
    console.log(films);
    filmsModel.setFilms(UpdateType.INIT, films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });

// переделать!
/*
const footerStat = new Stat(FilmSettings.FILMS_COUNT);
render(footerStatContainer, footerStat);
*/
