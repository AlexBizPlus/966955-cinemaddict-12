import FilterPresenter from "./presenter/filter.js";
import Menu from './view/menu';
import FilmSectionPresenter from './presenter/film-section';
import {
  render,
} from './utils/render';
import {
  UpdateType,
  BackendValues
} from './const';
import FilmsModel from './model/films';
import FilterModel from "./model/filter.js";
import Api from "./api.js";

const main = document.querySelector(`.main`);

const api = new Api(BackendValues.END_POINT, BackendValues.AUTHORIZATION);

const filmsModel = new FilmsModel();

const menu = new Menu();
render(main, menu);

const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(menu, filterModel, filmsModel);
const filmSectionPresenter = new FilmSectionPresenter(main, filmsModel, filterModel, api);

filterPresenter.init();
filmSectionPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    menu.getElement().style.display = ``;
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    menu.getElement().style.display = ``;
  });
