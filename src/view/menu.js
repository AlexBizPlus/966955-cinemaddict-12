import Abstract from './abstract';
export default class Menu extends Abstract {
  constructor() {
    super();

    this._statsClickHandler = this._statsClickHandler.bind(this);
  }

  getTemplate() {
    return `<nav class="main-navigation" style="display: none">
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`;
  }

  _statsClickHandler(evt) {
    evt.preventDefault();
    this._callback.statsClickHandler();
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.statsClickHandler = callback;
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, this._statsClickHandler);
  }
}
