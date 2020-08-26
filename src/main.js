import {
  createProfileTemplate
} from './view/profile.js';
import {
  createMenuTemplate
} from './view/menu.js';
import {
  createSortTemplate
} from './view/sort.js';
import {
  createFilmsTemplate
} from './view/films.js';
import {
  createFilmsListTemplate
} from './view/films-list.js';
import {
  createFilmsListContainerTemplate
} from './view/films-container.js';
import {
  createFilmCardTemplate
} from './view/film-card.js';
import {
  createShowMoreButtonTemplate
} from './view/show-more-button.js';
import {
  createFilmsListExtraTemplate
} from './view/films-list-extra.js';
import {
  createStatTemplate
} from './view/stat.js';
import {
  generateMockFilm
} from './mock/films.js';
// import {
//   createPopupTemplate
// } from './view/popup.js';

const FILM_LIST_COUNT = 20;
const FILM_COUNT_PER_STEP = 5;
const FILM_LIST_EXTRA_COUNT = 2;
const FILM_LIST_MOST_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const mockFilmList = new Array(FILM_LIST_COUNT).fill().map(generateMockFilm);

const header = document.querySelector(`.header`);

render(header, createProfileTemplate(), `beforeend`);

const main = document.querySelector(`.main`);

render(main, createMenuTemplate(mockFilmList), `beforeend`);
render(main, createSortTemplate(), `beforeend`);
render(main, createFilmsTemplate(), `beforeend`);

const sectionFilms = document.querySelector(`.films`);

render(sectionFilms, createFilmsListTemplate(), `beforeend`);
render(sectionFilms, createFilmsListExtraTemplate(), `beforeend`);
render(sectionFilms, createFilmsListExtraTemplate(), `beforeend`);

const filmsList = document.querySelector(`.films-list`);

render(filmsList, createFilmsListContainerTemplate(), `beforeend`);

const filmsListContainer = filmsList.querySelector(`.films-list__container`);

for (let i = 0; i < Math.min(mockFilmList.length, FILM_COUNT_PER_STEP); i++) {
  render(filmsListContainer, createFilmCardTemplate(mockFilmList[i]), `beforeend`);
}

if (mockFilmList.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  render(filmsList, createShowMoreButtonTemplate(), `beforeend`);

  const loadMoreButton = filmsList.querySelector(`.films-list__show-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    mockFilmList
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => render(filmsListContainer, createFilmCardTemplate(film), `beforeend`));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= mockFilmList.length) {
      loadMoreButton.remove();
    }
  });
}

// render(filmsList, createShowMoreButtonTemplate(), `beforeend`);

const filmsListExtra = document.querySelectorAll(`.films-list--extra`)[0];

render(filmsListExtra, createFilmsListContainerTemplate(), `beforeend`);

const filmsListExtraContainer = filmsListExtra.querySelector(`.films-list__container`);

for (let i = 0; i < FILM_LIST_EXTRA_COUNT; i++) {
  render(filmsListExtraContainer, createFilmCardTemplate(mockFilmList[i]), `beforeend`);
}

const filmsListMost = document.querySelectorAll(`.films-list--extra`)[1];

render(filmsListMost, createFilmsListContainerTemplate(), `beforeend`);

const filmsListMostContainer = filmsListMost.querySelector(`.films-list__container`);
let MostContainerTitle = filmsListMost.querySelector(`.films-list__title`);
MostContainerTitle.textContent = `Most commented`;

for (let i = 0; i < FILM_LIST_MOST_COUNT; i++) {
  render(filmsListMostContainer, createFilmCardTemplate(mockFilmList[i]), `beforeend`);
}

const footerStatistics = document.querySelector(`.footer__statistics`);

render(footerStatistics, createStatTemplate(FILM_LIST_COUNT), `beforeend`);

/* render popup  */
// const body = document.querySelector(`body`);
// render(body, createPopupTemplate(mockFilmList[0]), `beforeend`);
