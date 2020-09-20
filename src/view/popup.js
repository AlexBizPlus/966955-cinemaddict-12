import he from "he";
import moment from 'moment';
import SmartView from "./smart.js";
import {
  EMOJIS
} from "../const";
import {
  isCtrlEnterPressed
} from "../utils/common";

export default class Popup extends SmartView {
  constructor(film) {
    super();
    this._data = Popup.parseFilmToData(film);

    this._closePopupHandler = this._closePopupHandler.bind(this);
    this._addWatchlistHandler = this._addWatchlistHandler.bind(this);
    this._addHistoryHandler = this._addHistoryHandler.bind(this);
    this._addFavoritesHandler = this._addFavoritesHandler.bind(this);
    this._addEmojiHandler = this._addEmojiHandler.bind(this);
    this._addCommentHandler = this._addCommentHandler.bind(this);
    this._removeCommentHandler = this._removeCommentHandler.bind(this);

    this._setInnerHandlers();
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setClosePopupHandler(this._callback.closePopup);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`#watchlist`)
      .addEventListener(`click`, this._addWatchlistHandler);

    this.getElement()
      .querySelector(`#watched`)
      .addEventListener(`click`, this._addHistoryHandler);

    this.getElement()
      .querySelector(`#favorite`)
      .addEventListener(`click`, this._addFavoritesHandler);

    this.getElement()
      .querySelector(`.film-details__emoji-list`)
      .addEventListener(`change`, this._addEmojiHandler);

    this.getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, this._addCommentHandler);

    this.getElement()
      .querySelector(`.film-details__comments-list`)
      .addEventListener(`click`, this._removeCommentHandler);
  }

  _addWatchlistHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isWatchlist: !this._data.isWatchlist
    });
  }

  _addHistoryHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isHistory: !this._data.isHistory
    });
  }

  _addFavoritesHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isFavorites: !this._data.isFavorites
    });
  }

  _addEmojiHandler(evt) {
    evt.preventDefault();
    this.updateData({
      currentComment: Object.assign({}, this._data.currentComment, {
        emoji: evt.target.value
      })
    });
  }

  _addCommentHandler(evt) {
    if (isCtrlEnterPressed(evt)) {
      evt.preventDefault();
      const newComment = Object.assign({}, this._data.currentComment, {
        comment: evt.target.value,
        day: moment().format(`YYYY/MM/DD HH:mm`)
      });
      this._textAreaValue = evt.target.value;
      this.updateComments(newComment);
    }
  }

  _removeCommentHandler(evt) {
    if (evt.target.tagName !== `BUTTON`) {
      return;
    }
    evt.preventDefault();
    this.deleteComment(evt.target.dataset.commentNumber);
    evt.target.setAttribute(`disabled`, `disabled`);
    evt.target.innerText = `Deleting...`;
  }

  _closePopupHandler(evt) {
    evt.preventDefault();
    this._callback.closePopup(Popup.parseDataToFilm(this._data));
  }

  setClosePopupHandler(callback) {
    this._callback.closePopup = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closePopupHandler);
  }

  getTemplate() {
    const {
      poster, title, alternativeTitle, description, totalRating, releaseDate, runtime, genre,
      comments, currentComment, age, director, writers, actors, country,
      isWatchlist, isHistory, isFavorites
    } = this._data;

    const renderGenres = () => {
      let result = [];
      for (let i = 0; i < genre.length; i++) {
        result.push(`<span class="film-details__genre">${genre[i]}</span>`);
      }
      return result.join(` `);
    };

    const checkGenres = () => {
      return genre.length > 0 ? `Genres` : `Genre`;
    };

    const createEmojisTemplate = (checkedEmoji) => {
      return EMOJIS.map((emoji) => `<input
      class="film-details__emoji-item visually-hidden"
      name="comment-emoji" type="radio"
      id="emoji-${emoji}"
      ${checkedEmoji === emoji ? `checked` : ``}
      value="${emoji}">
      <label
      class="film-details__emoji-label"
      for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
      </label>`).join(``);
    };

    const createEmojiImageTemplate = (checkedEmoji) => {
      return checkedEmoji ?
        `<img src="images/emoji/${checkedEmoji}.png" width="55" height="55" alt="emoji-${checkedEmoji}">` :
        ``;
    };

    const renderComments = () => {
      let result = [];
      for (let i = 0; i < comments.length; i++) {
        const emojiTest = (comments[i].emoji === null)
          ? ``
          : `src="./images/emoji/${comments[i].emoji}.png" alt="emoji-${comments[i].emoji}" `;

        result.push(`
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img ${emojiTest}" width="55" height="55">
        </span>
        <div>
          <p class="film-details__comment-text">${he.encode(comments[i].comment)}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${comments[i].author}</span>
            <span class="film-details__comment-day">${comments[i].day}</span>
            <button type="button" class="film-details__comment-delete" data-comment-number="${comments[i].id}-${i}">Delete</button>
          </p>
        </div>
      </li>`);
      }
      return result.join(` `);
    };

    const checkProps = (property) => {
      return property ? ` checked ` : ``;
    };

    return `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${age}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${releaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${runtime}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${checkGenres()}</td>
              <td class="film-details__cell">${renderGenres()}</td>
            </tr>
          </table>

            <p class="film-details__film-description">
            ${description}
            </p>
          </div>
        </div>

      <section class="film-details__controls">
        <input type="checkbox" ${checkProps(isWatchlist)}
        class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" ${checkProps(isHistory)}
        class="film-details__control-input visually-hidden" id="watched" name="watched">
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" ${checkProps(isFavorites)}
        class="film-details__control-input visually-hidden" id="favorite" name="favorite">
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${renderComments()}
        </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">
              ${createEmojiImageTemplate(currentComment.emoji)}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                ${createEmojisTemplate(currentComment.emoji)}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`;
  }

  static parseFilmToData(film) {
    return Object.assign({}, film);
  }

  static parseDataToFilm(data) {
    return Object.assign({}, data);
  }
}
