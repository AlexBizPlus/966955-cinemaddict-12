import Abstract from './abstract';
import {
  humanizeTaskDueDate
} from '../utils/films';
export default class Film extends Abstract {
  constructor(film) {
    super();
    this._film = film;
    this._clickHandler = this._clickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._historyClickHandler = this._historyClickHandler.bind(this);
    this._favoritesClickHandler = this._favoritesClickHandler.bind(this);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _historyClickHandler(evt) {
    evt.preventDefault();
    this._callback.historyClick();
  }

  _favoritesClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoritesClick();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`img`).addEventListener(`click`, this._clickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  setHistoryClickHandler(callback) {
    this._callback.historyClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._historyClickHandler);
  }

  setFavoritesClickHandler(callback) {
    this._callback.favoritesClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favoritesClickHandler);
  }

  getTemplate() {
    const {
      poster, title, description, totalRating, releaseDate, runtime, genre, comments, isWatchlist, isHistory, isFavorites
    } = this._film;

    const checkProps = (property) => {
      return property ? `film-card__controls-item--active` : ``;
    };

    return `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${humanizeTaskDueDate(releaseDate)}</span>
        <span class="film-card__duration">${runtime}</span>
        <span class="film-card__genre">${genre.join(` `)}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item
         ${checkProps(isWatchlist)}
         film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item
        ${checkProps(isHistory)}
        button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item
        ${checkProps(isFavorites)}
        button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`;
  }
}
