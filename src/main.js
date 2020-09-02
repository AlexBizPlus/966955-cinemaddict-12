import Profile from './view/profile';
import Menu from './view/menu';
import Sort from './view/sort';
import Films from './view/films';
import FilmsList from './view/films-list';
import FilmsListContainer from './view/films-container';
import Film from './view/film-card';
import ShowMoreButton from './view/show-more-button';
import FilmsListExtra from './view/films-list-extra';
import Stat from './view/stat';
import {
  generateMockFilm
} from './mock/films';
import {
  RenderPosition,
  render
} from './utils';

import Popup from './view/popup.js';

const FilmSettings = {
  COUNT: 20,
  PER_STEP: 5,
  EXTRA_COUNT: 2,
  MOST_COUNT: 2,
};

const mockFilmList = new Array(FilmSettings.COUNT).fill().map(generateMockFilm);

const header = document.querySelector(`.header`);
const body = document.querySelector(`body`);

const renderFilm = (container, film) => {
  const filmComponent = new Film(film);
  const filmPopupComponent = new Popup(film);

  filmComponent.getElement().querySelector(`img`).addEventListener(`click`, () => {
    render(body, filmPopupComponent.getElement(), RenderPosition.BEFOREEND);
  });

  filmPopupComponent.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, (evt) => {
    evt.preventDefault();
    filmPopupComponent.getElement().remove();
  });

  render(container, filmComponent.getElement(), RenderPosition.BEFOREEND);
};

render(header, new Profile().getElement(), RenderPosition.BEFOREEND);

const main = document.querySelector(`.main`);

render(main, new Menu(mockFilmList).getElement(), RenderPosition.BEFOREEND);
render(main, new Sort().getElement(), RenderPosition.BEFOREEND);
render(main, new Films().getElement(), RenderPosition.BEFOREEND);

const sectionFilms = document.querySelector(`.films`);

render(sectionFilms, new FilmsList().getElement(), RenderPosition.BEFOREEND);
render(sectionFilms, new FilmsListExtra().getElement(), RenderPosition.BEFOREEND);
render(sectionFilms, new FilmsListExtra().getElement(), RenderPosition.BEFOREEND);

const filmsList = document.querySelector(`.films-list`);

render(filmsList, new FilmsListContainer().getElement(), RenderPosition.BEFOREEND);

const filmsListContainer = filmsList.querySelector(`.films-list__container`);

for (let i = 0; i < Math.min(mockFilmList.length, FilmSettings.PER_STEP); i++) {
  renderFilm(filmsListContainer, mockFilmList[i]);
}

if (mockFilmList.length > FilmSettings.PER_STEP) {
  let renderedFilmCount = FilmSettings.PER_STEP;

  render(filmsList, new ShowMoreButton().getElement(), RenderPosition.BEFOREEND);

  const loadMoreButton = filmsList.querySelector(`.films-list__show-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    mockFilmList
      .slice(renderedFilmCount, renderedFilmCount + FilmSettings.PER_STEP)
      .forEach((film) => renderFilm(filmsListContainer, film));

    renderedFilmCount += FilmSettings.PER_STEP;

    if (renderedFilmCount >= mockFilmList.length) {
      loadMoreButton.remove();
    }
  });
}

const filmsListExtra = document.querySelectorAll(`.films-list--extra`)[0];

render(filmsListExtra, new FilmsListContainer().getElement(), RenderPosition.BEFOREEND);

const filmsListExtraContainer = filmsListExtra.querySelector(`.films-list__container`);

for (let i = 0; i < FilmSettings.EXTRA_COUNT; i++) {
  renderFilm(filmsListExtraContainer, mockFilmList[i]);
}

const filmsListMost = document.querySelectorAll(`.films-list--extra`)[1];

render(filmsListMost, new FilmsListContainer().getElement(), RenderPosition.BEFOREEND);

const filmsListMostContainer = filmsListMost.querySelector(`.films-list__container`);
let mostContainerTitle = filmsListMost.querySelector(`.films-list__title`);
mostContainerTitle.textContent = `Most commented`;

for (let i = 0; i < FilmSettings.MOST_COUNT; i++) {
  renderFilm(filmsListMostContainer, mockFilmList[i]);
}

const footerStatistics = document.querySelector(`.footer__statistics`);

render(footerStatistics, new Stat(FilmSettings.COUNT).getElement(), RenderPosition.BEFOREEND);
