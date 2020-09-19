export const SHAKE_ANIMATION_TIMEOUT = 600;

export const EMOJIS = [`smile`, `sleeping`, `puke`, `angry`];

export const SortType = {
  BY_DEFAULT: `by-default`,
  BY_DATE: `by-date`,
  BY_RATING: `by-rating`
};

export const FilmSettings = {
  FILMS_COUNT: 9,
  PER_STEP: 5,
  EXTRA_COUNT: 2,
  MOST_COUNT: 2,
};

export const UserAction = {
  UPDATE_FILM: `UPDATE_FILM`,
  ADD_COMMENT: `ADD_COMMENT`,
  DELETE_COMMENT: `DELETE_COMMENT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const FilterType = {
  ALL: `All movies`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`,
};

export const ProfileRating = {
  NOVICE: `novice`,
  FAN: `fan`,
  MOVIE_BUFF: `movie buff`
};

export const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const BackendValues = {
  AUTHORIZATION: `Basic 12y9443aazaer71q`,
  END_POINT: `https://12.ecmascript.pages.academy/cinemaddict`
};

export const header = document.querySelector(`.header`);
export const footerStatContainer = document.querySelector(`.footer__statistics`);
