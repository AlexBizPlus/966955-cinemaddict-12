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

const FILM_LIST_COUNT = 5;
const FILM_LIST_EXTRA_COUNT = 2;
const FILM_LIST_MOST_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const header = document.querySelector('.header');

render(header, createProfileTemplate(), `beforeend`);

const main = document.querySelector('.main');

render(main, createMenuTemplate(), `beforeend`);
render(main, createSortTemplate(), `beforeend`);
render(main, createFilmsTemplate(), `beforeend`);

const sectionFilms = document.querySelector('.films');

render(sectionFilms, createFilmsListTemplate(), `beforeend`);
render(sectionFilms, createFilmsListExtraTemplate(), `beforeend`);
render(sectionFilms, createFilmsListExtraTemplate(), `beforeend`);

const filmsList = document.querySelector('.films-list');

render(filmsList, createFilmsListContainerTemplate(), `beforeend`);
render(filmsList, createShowMoreButtonTemplate(), `beforeend`);

const filmsListContainer = filmsList.querySelector('.films-list__container');

for (let i = 0; i < FILM_LIST_COUNT; i++) {
  render(filmsListContainer, createFilmCardTemplate(), `beforeend`);
}

const filmsListExtra = document.querySelectorAll('.films-list--extra')[0];

render(filmsListExtra, createFilmsListContainerTemplate(), `beforeend`);

const filmsListExtraContainer = filmsListExtra.querySelector('.films-list__container');

for (let i = 0; i < FILM_LIST_EXTRA_COUNT; i++) {
  render(filmsListExtraContainer, createFilmCardTemplate(), `beforeend`);
}

const filmsListMost = document.querySelectorAll('.films-list--extra')[1];

render(filmsListMost, createFilmsListContainerTemplate(), `beforeend`);

const filmsListMostContainer = filmsListMost.querySelector('.films-list__container');
let MostContainerTitle = filmsListMost.querySelector('.films-list__title');
MostContainerTitle.textContent = 'Most commented';

for (let i = 0; i < FILM_LIST_MOST_COUNT; i++) {
  render(filmsListMostContainer, createFilmCardTemplate(), `beforeend`);
}

const footerStatistics = document.querySelector('.footer__statistics');

render(footerStatistics, createStatTemplate(), `beforeend`);
