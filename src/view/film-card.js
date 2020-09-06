import Abstract from './abstract';
import {
  humanizeTaskDueDate
} from '../utils/films';
export default class Film extends Abstract {
  constructor(film) {
    super();
    this._film = film;
    this._clickHandler = this._clickHandler.bind(this);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`img`).addEventListener(`click`, this._clickHandler);
  }

  getTemplate() {
    const {
      poster, title, description, totalRating, releaseDate, runtime, genre, comments
    } = this._film;

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
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`;
  }
}
