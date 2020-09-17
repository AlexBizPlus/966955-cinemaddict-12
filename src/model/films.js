import Observer from "../utils/observer.js";
import {
  getRandomComment
} from "../mock/films";

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addFilm(updateType, update) {
    this._films = [
      update,
      ...this._films
    ];

    this._notify(updateType, update);
  }

  deleteFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign({}, film, {
      poster: film.film_info.poster,
      title: film.film_info.title,
      alternativeTitle: film.film_info.alternative_title,
      description: film.film_info.description,
      totalRating: film.film_info.total_rating,
      releaseDate: film.film_info.release.date,
      runtime: film.film_info.runtime,
      genre: film.film_info.genre,
      comments: getRandomComment(),
      age: film.film_info.age_rating,
      director: film.film_info.director,
      writers: film.film_info.writers,
      actors: film.film_info.actors,
      country: film.film_info.release.release_country,
      isWatchlist: film.user_details.watchlist,
      isHistory: film.user_details.already_watched,
      isFavorites: film.user_details.favorite,
      watchingDate: film.user_details.watching_date,
      currentComment: {
        comment: null,
        emoji: null,
        author: null,
        day: null
      },
    });

    // Ненужные ключи мы удаляем
    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    // delete adaptedFilm.film_info.poster;
    // delete adaptedFilm.film_info.title;
    // delete adaptedFilm.film_info.alternative_title;
    // delete adaptedFilm.film_info.description;
    // delete adaptedFilm.film_info.total_rating;
    // delete adaptedFilm.film_info.release.date;
    // delete adaptedFilm.film_info.runtime;
    // delete adaptedFilm.film_info.genre;
    // delete adaptedFilm.film_info.age_rating;
    // delete adaptedFilm.film_info.director;
    // delete adaptedFilm.film_info.writers;
    // delete adaptedFilm.film_info.actors;
    // delete adaptedFilm.film_info.release.release_country;
    // delete adaptedFilm.user_details.watchlist;
    // delete adaptedFilm.user_details.already_watched;
    // delete adaptedFilm.user_details.favorite;
    // delete adaptedFilm.user_details.watching_date;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign({}, film, {
      "film_info": Object.assign({}, film.film_info, {
        // poster: poster,
        // title: title
      })



      // "is_archived": film.isArchive,
      // "is_favorite": film.isFavorite,
      // "repeating_days": film.repeating,
      /*
            film.film_info.poster: poster,
            film.film_info.title: title,
            alternativeTitle: film.film_info.alternative_title,
            description: film.film_info.description,
            totalRating: film.film_info.total_rating,
            releaseDate: film.film_info.release.date,
            runtime: film.film_info.runtime,
            genre: film.film_info.genre,
            age: film.film_info.age_rating,
            director: film.film_info.director,
            writers: film.film_info.writers,
            actors: film.film_info.actors,
            country: film.film_info.release.release_country,
            isWatchlist: film.film_info.user_details.watchlist,
            isHistory: film.film_info.user_details.already_watched,
            isFavorites: film.film_info.user_details.favorite,
            watchingDate: film.film_info.user_details.watching_date

            */

    });

    // Ненужные ключи мы удаляем
    // delete adaptedFilm.film_info;
    // delete adaptedFilm.user_details;

    return adaptedFilm;
  }
}
