import Films from '../view/films';
import FilmsList from '../view/films-list';
import FilmsListContainer from '../view/films-container';
import FilmsListExtra from '../view/films-list-extra';
import FilmsListMost from '../view/films-list-most';
import Sort from '../view/sort';
import NoFilm from '../view/no-films';
import Film from '../view/film-card';
import Popup from '../view/popup';
import ShowMoreButton from '../view/show-more-button';
import {
  render,
  remove
} from '../utils/render';
import {
  sortFilmByDate,
  sortFilmByRating
} from '../utils/films';
import {
  SortType
} from '../const';

export const FilmSettings = {
  PER_STEP: 5,
  EXTRA_COUNT: 2,
  MOST_COUNT: 2,
};
const body = document.querySelector(`body`);

export default class FilmSection {
  constructor(container) {
    this.filmSectionContainer = container;

    this._currentSortType = SortType.DEFAULT;
    this._renderedFilmCount = FilmSettings.PER_STEP;
    this._renderedFilmExtraCount = FilmSettings.EXTRA_COUNT;
    this._renderedFilmMostCount = FilmSettings.MOST_COUNT;
    this._filmsComponent = new Films();
    this._filmsListComponent = new FilmsList();
    this._filmsListMainContainerComponent = new FilmsListContainer();
    this._filmsListExtraContainer = new FilmsListContainer();
    this._filmsListMostContainer = new FilmsListContainer();
    this._filmsListExtra = new FilmsListExtra();
    this._filmsListMost = new FilmsListMost();
    this._sortComponent = new Sort();
    this._noFilmComponent = new NoFilm();
    this._showMoreButtonComponent = new ShowMoreButton();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();

    render(this.filmSectionContainer, this._filmsComponent);
    this._renderFilmSection();
  }

  _renderSort() {
    render(this._filmsComponent, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    this._sortButtonList = document.querySelectorAll(`.sort__button`);
  }

  _clearFilmList() {
    this._filmsListMainContainerComponent.getElement().innerHTML = ``;
    this._renderedFilmCount = FilmSettings.PER_STEP;
  }

  _renderFilm(container, film) {
    const filmComponent = new Film(film);
    const filmPopupComponent = new Popup(film);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        remove(filmPopupComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    filmComponent.setClickHandler(() => {
      render(body, filmPopupComponent);
      document.addEventListener(`keydown`, onEscKeyDown);

      filmPopupComponent.setClosePopupHandler(() => {
        remove(filmPopupComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });
    });

    render(container, filmComponent);
  }

  _renderFilms(container, from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilm(container, film));
  }

  _renderNoFilm() {
    render(this._filmsComponent, this._noFilmComponent);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._filmsListMainContainerComponent, this._renderedFilmCount, this._renderedFilmCount + FilmSettings.PER_STEP);
    this._renderedFilmCount += FilmSettings.PER_STEP;

    if (this._renderedFilmCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderFilmSection() {
    if (this._films.length === 0) {
      this._renderNoFilm();
      return;
    }
    this._renderSort();
    render(this._filmsComponent, this._filmsListComponent);

    render(this._filmsListComponent, this._filmsListMainContainerComponent);

    this._renderFilms(this._filmsListMainContainerComponent, 0, Math.min(this._films.length, this._renderedFilmCount));

    if (this._films.length > this._renderedFilmCount) {
      this._renderShowMoreButton();
    }

    render(this._filmsComponent, this._filmsListExtra);

    this._renderFilmsExtra();

    render(this._filmsComponent, this._filmsListMost);

    this._renderFilmsMost();
  }

  _renderFilmsExtra() {
    render(this._filmsListExtra, this._filmsListExtraContainer);
    this._renderFilms(this._filmsListExtraContainer, 0, this._renderedFilmExtraCount);
  }

  _renderFilmsMost() {
    render(this._filmsListMost, this._filmsListMostContainer);
    this._renderFilms(this._filmsListMostContainer, 0, this._renderedFilmMostCount);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.BY_DATE:
        this._films.sort(sortFilmByDate);
        break;
      case SortType.BY_RATING:
        this._films.sort(sortFilmByRating);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _renderFilmList() {
    this._renderFilms(this._filmsListMainContainerComponent, 0, Math.min(this._films.length, FilmSettings.PER_STEP));

    if (this._films.length > FilmSettings.PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _changeColorSortLink() {
    this._sortButtonList.forEach((item) => item.classList.contains(`sort__button--active`)
      ? item.classList.remove(`sort__button--active`)
      : null);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._changeColorSortLink(sortType);

    this._sortFilms(sortType);
    this._clearFilmList();
    this._renderFilmList();
  }
}
