import Films from '../view/films';
import FilmsList from '../view/films-list';
import FilmsListContainer from '../view/films-container';
import FilmsListExtra from '../view/films-list-extra';
import FilmsListMost from '../view/films-list-most';
import Sort from '../view/sort';
import NoFilm from '../view/no-films';
import ShowMoreButton from '../view/show-more-button';
import FilmPresenter from './film-card';
import Profile from '../view/profile';
import Loading from '../view/loading';
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
  sortFilmById
} from '../utils/films';
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

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._filmSectionContainer, this._filmsComponent);

    render(this._filmsComponent, this._filmsListComponent);
    render(this._filmsListComponent, this._filmsListMainContainerComponent);

    // render(this._filmsComponent, this._filmsListExtra);
    // render(this._filmsListExtra, this._filmsListExtraContainer);

    // render(this._filmsComponent, this._filmsListMost);
    // render(this._filmsListMost, this._filmsListMostContainer);

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
    }
    // case SortType.BY_DEFAULT:
    // return filtredFilms;
    return filtredFilms.sort(sortFilmById);

    // return filtredFilms;
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

    remove(this._profile);
    remove(this._sortComponent);
    remove(this._noFilmComponent);
    remove(this._showMoreButtonComponent);
    remove(this._loadingComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FilmSettings.PER_STEP;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.BY_DEFAULT;
    }
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
        console.log(`UpdateType.MINOR`);
        this._clearFilmSection();
        this._renderFilmSection();
        break;
      case UpdateType.MAJOR:
        console.log(`UpdateType.MAJOR`);
        this._clearFilmSection({
          resetRenderedFilmCount: true, resetSortType: true
        });
        this._renderFilmSection();
        break;
      case UpdateType.INIT:
        console.log(`UpdateType.INIT`);
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmSection();
        this._renderFooterStat();
        break;
    }
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
    render(this._filmsComponent, this._filmsListExtra);
    render(this._filmsListExtra, this._filmsListExtraContainer);

    const films = this._filmsModel.getFilms().slice().sort(sortFilmByRating).slice(0, FilmSettings.EXTRA_COUNT);
    this._renderFilms(films, this._filmsListExtraContainer);
  }

  _renderFilmsMost() {
    render(this._filmsComponent, this._filmsListMost);
    render(this._filmsListMost, this._filmsListMostContainer);

    const films = this._filmsModel.getFilms().slice().sort(sortFilmByComments).slice(0, FilmSettings.MOST_COUNT);
    this._renderFilms(films, this._filmsListMostContainer);
  }

  _renderProfileRating() {
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[FilterType.HISTORY](films);
    this._profile = new Profile(filtredFilms.length);
    render(this._profileContainer, this._profile);
  }

  _renderFooterStat() {
    const filmsCount = this._filmsModel.getFilms();
    const footerStat = new Stat(filmsCount.length);
    render(footerStatContainer, footerStat);
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
}
