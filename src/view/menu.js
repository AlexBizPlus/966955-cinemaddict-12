import Abstract from './abstract';
export default class Menu extends Abstract {
  constructor(filmsList) {
    super();
    this._filmsList = filmsList;
  }

  getTemplate() {
    const filmToFilterMap = {
      watchlist: this._filmsList.filter((film) => film.isWatchlist).length,
      history: this._filmsList.filter((film) => film.isHistory).length,
      favorites: this._filmsList.filter((film) => film.isFavorites).length,
    };

    return `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">
        ${filmToFilterMap.watchlist}
        </span></a>
        <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">
        ${filmToFilterMap.history}
        </span></a>
        <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">
        ${filmToFilterMap.favorites}
        </span></a>
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`;
  }
}
