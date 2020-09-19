import Film from '../view/film-card';
import Popup from '../view/popup';
import {
  render,
  remove,
  replace
} from '../utils/render';
import {
  UserAction,
  UpdateType,
  BackendValues,
  Mode
} from "../const.js";
import Api from "../api.js";

const api = new Api(BackendValues.END_POINT, BackendValues.AUTHORIZATION);
const body = document.querySelector(`body`);
export default class FilmCard {
  constructor(container, changeData, changeMode) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._mode = Mode.DEFAULT;

    this._handlePopupOpenClick = this._handlePopupOpenClick.bind(this);
    this._handlePopupCloseClick = this._handlePopupCloseClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmComponent = new Film(film);

    api.getComments(this._film)
      .then((result) => {
        this._filmPopupComponent = new Popup(result);
      })
      .catch(() => {
        this._filmPopupComponent = new Popup(film);
      });

    this._filmComponent.setClickHandler(this._handlePopupOpenClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setHistoryClickHandler(this._handleHistoryClick);
    this._filmComponent.setFavoritesClickHandler(this._handleFavoritesClick);

    if (prevFilmComponent === null) {
      render(this._container, this._filmComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._filmPopupComponent, prevFilmPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevFilmPopupComponent);
  }

  _removefilmPopupComponent() {
    remove(this._filmPopupComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._removefilmPopupComponent();
      this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, Object.assign({}, this._film));
    }
  }

  _handlePopupOpenClick() {
    render(body, this._filmPopupComponent);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._filmPopupComponent.setClosePopupHandler(this._handlePopupCloseClick);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _handlePopupCloseClick(film) {
    this._removefilmPopupComponent();
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, Object.assign({}, film));
  }

  _handleWatchlistClick() {
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, Object.assign({}, this._film, {
      isWatchlist: !this._film.isWatchlist
    }));
  }

  _handleHistoryClick() {
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, Object.assign({}, this._film, {
      isHistory: !this._film.isHistory
    }));
  }

  _handleFavoritesClick() {
    this._changeData(UserAction.UPDATE_FILM, UpdateType.MINOR, Object.assign({}, this._film, {
      isFavorites: !this._film.isFavorites
    }));
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmPopupComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._removefilmPopupComponent();
    }
  }
}
