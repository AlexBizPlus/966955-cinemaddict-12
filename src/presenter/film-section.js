import Films from '../view/films';
import FilmsList from '../view/films-list';
import FilmsListContainer from '../view/films-list-container';
import FilmsListExtra from '../view/films-list-extra';
import FilmsListMost from '../view/films-list-most';
import Sort from '../view/sort';
import NoFilm from '../view/no-films';
import ShowMoreButton from '../view/show-more-button';
import FilmPresenter from './film-card';
import Profile from '../view/profile';
import Loading from '../view/loading';
import FooterStat from '../view/footer-stat';
import Stat from '../view/stat';
import {
  filter
} from '../utils/filter.js';
import {
  render,
  remove,
} from '../utils/render';
import {
  sortFilmByDate,
  sortFilmByRating,
  sortFilmByComments,
  sortFilmById,
  checkTheSameProps
} from '../utils/films';
import {
  getNewRandomElement
} from '../utils/common';
import {
  header,
  footerStatContainer,
  SortType,
  UpdateType,
  UserAction,
  FilmSettings,
  FilterType,
  RenderPosition
} from '../const';
export default class FilmSection {
  constructor(container, filmsModel, filterModel, api) {
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._filmSectionContainer = container;
    this._api = api;

    this._currentSortType = SortType.BY_DEFAULT;
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
    this._noFilmComponent = new NoFilm();
    this._loadingComponent = new Loading();

    this._profileContainer = header;

    this._sortComponent = null;
    this._showMoreButtonComponent = null;
    this._isLoading = true;

    this._filmPresenter = {};

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleStatClick = this._handleStatClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._filmSectionContainer, this._filmsComponent);

    render(this._filmsComponent, this._filmsListComponent);
    render(this._filmsListComponent, this._filmsListMainContainerComponent);

    this._renderFilmSection();
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.BY_DATE:
        return filtredFilms.sort(sortFilmByDate);
      case SortType.BY_RATING:
        return filtredFilms.sort(sortFilmByRating);
      default:
        return filtredFilms.sort(sortFilmById);
    }
  }

  _clearFilmSection({
    resetRenderedFilmCount = false,
    resetSortType = false
  } = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};

    remove(this._sortComponent);
    remove(this._noFilmComponent);
    remove(this._showMoreButtonComponent);
    remove(this._loadingComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FilmSettings.PER_STEP;
    } else {
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.BY_DEFAULT;
    }

    if (this._filterModel.getFilter() === FilterType.STAT) {
      return;
    }
    remove(this._statComponent);
    remove(this._profile);
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    if (actionType === UserAction.UPDATE_FILM) {
      this._api.updateFilm(update).then((response) => {
        this._filmsModel.updateFilm(updateType, response);
      });
    }
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._clearFilmSection();
        this._renderFilmSection();
        break;
      case UpdateType.MAJOR:
        this._clearFilmSection({
          resetRenderedFilmCount: true, resetSortType: true
        });
        this._renderFilmSection();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmSection();
        this._renderFooterStat();
        break;
      default:
        return;
    }
  }

  _handleShowMoreButtonClick() {
    const filmCount = this._getFilms().length;

    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + FilmSettings.PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmCount);

    this._renderFilms(films);
    this._renderedFilmCount = newRenderedFilmCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleStatClick() {
    this._filterModel.setFilter(null, FilterType.STAT);
    this._clearFilmSection({
      resetRenderedFilmCount: true, resetSortType: true
    });

    this._renderStat();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearFilmSection({
      resetRenderedFilmCount: true
    });

    this._renderFilmSection();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new Sort(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._filmsComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFilm(film, container = this._filmsListMainContainerComponent) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModeChange);
    filmPresenter.init(film);

    let id;
    switch (container) {
      case this._filmsListExtraContainer:
        id = `Extra` + film.id;
        break;
      case this._filmsListMostContainer:
        id = `Most` + film.id;
        break;
      default:
        id = film.id;
        break;
    }

    this._filmPresenter[id] = filmPresenter;
  }

  _renderFilms(films, container) {
    films.forEach((film) => this._renderFilm(film, container));
  }

  _renderNoFilm() {
    remove(this._filmsListExtra);
    remove(this._filmsListMost);
    render(this._filmsListMainContainerComponent, this._noFilmComponent);
  }

  _renderLoading() {
    render(this._filmsListMainContainerComponent, this._loadingComponent);
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }
    this._showMoreButtonComponent = new ShowMoreButton();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._filmsListComponent, this._showMoreButtonComponent);
  }

  _renderFilmSection() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    const films = this._getFilms();
    const filmCount = films.length;

    const watchedFilms = filter[FilterType.HISTORY](this._filmsModel.getFilms());
    this._statComponent = new Stat(watchedFilms);
    this._statComponent.setStatClickHandler(this._handleStatClick);

    if (filmCount === 0) {
      this._renderNoFilm();
      return;
    }

    this._renderSort();

    this._renderFilms(films.slice(0, Math.min(filmCount, this._renderedFilmCount)));

    if (filmCount > this._renderedFilmCount) {
      this._renderShowMoreButton();
    }
    this._renderFilmsExtra();
    this._renderFilmsMost();
    this._renderProfileRating();
  }

  _renderFilmsExtra() {
    if (this._filmsModel.getFilms().length > 0) {
      render(this._filmsComponent, this._filmsListExtra);
      render(this._filmsListExtra, this._filmsListExtraContainer);

      const films = this._filmsModel.getFilms().slice().sort(sortFilmByRating).slice(0, FilmSettings.EXTRA_COUNT);
      if (checkTheSameProps(`totalRating`, this._filmsModel.getFilms().slice().sort(sortFilmByRating))) {
        films = getNewRandomElement(this._filmsModel.getFilms().slice().sort(sortFilmByRating), FilmSettings.EXTRA_COUNT);
      }

      this._renderFilms(films, this._filmsListExtraContainer);
    }
  }

  _renderFilmsMost() {
    if (this._filmsModel.getFilms().length > 0) {
      render(this._filmsComponent, this._filmsListMost);
      render(this._filmsListMost, this._filmsListMostContainer);

      const films = this._filmsModel.getFilms().slice().sort(sortFilmByComments).slice(0, FilmSettings.MOST_COUNT);
      if (checkTheSameProps(`totalRating`, this._filmsModel.getFilms().slice().sort(sortFilmByRating))) {
        films = getNewRandomElement(this._filmsModel.getFilms().slice().sort(sortFilmByRating), FilmSettings.MOST_COUNT);
      }

      this._renderFilms(films, this._filmsListMostContainer);
    }
  }

  _renderProfileRating() {
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[FilterType.HISTORY](films);
    this._profile = new Profile(filtredFilms.length);
    render(this._profileContainer, this._profile);
  }

  _renderFooterStat() {
    const filmsCount = this._filmsModel.getFilms();
    const footerStat = new FooterStat(filmsCount.length);
    render(footerStatContainer, footerStat);
  }

  _renderStat() {
    remove(this._filmsListExtra);
    remove(this._filmsListMost);
    render(this._filmsListMainContainerComponent, this._statComponent);
    this._statComponent.myChart();
  }
}
