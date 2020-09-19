import {
  FilterType
} from "../const";
// import {
//   isTaskExpired, isTaskExpiringToday, isTaskRepeating
// } from "./film";

export const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isHistory),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorites),
};
