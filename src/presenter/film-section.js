import Films from '../view/films';
import FilmsList from '../view/films-list';
import FilmsListContainer from '../view/films-container';
import FilmsListExtra from '../view/films-list-extra';
import FilmsListMost from '../view/films-list-most';
import Sort from '../view/sort';
import NoFilm from '../view/no-films';
import ShowMoreButton from '../view/show-more-button';
import FilmPresenter from './film-card';
import {
  render,
  remove
} from '../utils/render';
import {
  sortFilmByDate,
  sortFilmByRating
} from '../utils/films';
import {
  updateItem
} from '../utils/common';
import {
  SortType,
  FilmSettings
} from '../const';
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
    this._filmPresenter = {};

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films, filmsExtra, filmsMost) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();
    this._filmsExtra = filmsExtra.slice();
    this._filmsMost = filmsMost.slice();

    render(this.filmSectionContainer, this._filmsComponent);
    this._renderFilmSection();
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }

  _renderSort() {
    render(this._filmsComponent, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    this._sortButtonList = document.querySelectorAll(`.sort__button`);
  }

  _clearFilmList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmCount = FilmSettings.PER_STEP;
  }

  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);

    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilms(container, from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilm(container, film));
  }

  _renderFilmNoMain(container, film) {
    const filmPresenter = new FilmPresenter(container);
    filmPresenter.init(film);
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
    this._filmsExtra
      .slice(0, this._renderedFilmExtraCount)
      .forEach((film) => this._renderFilmNoMain(this._filmsListExtraContainer, film));
  }

  _renderFilmsMost() {
    render(this._filmsListMost, this._filmsListMostContainer);
    this._filmsMost
      .slice(0, this._renderedFilmMostCount)
      .forEach((film) => this._renderFilmNoMain(this._filmsListMostContainer, film));
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
