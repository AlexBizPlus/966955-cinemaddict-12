import moment from "moment";

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }
  return null;
};

const formatDate = (date) => moment(date, `DD MMMM YYYY`).format(`YYYYMMDD`);

export const sortFilmByDate = (FilmA, FilmB) => {
  const weight = getWeightForNullDate(FilmA.releaseDate, FilmB.releaseDate);

  if (weight !== null) {
    return weight;
  }
  return formatDate(FilmB.releaseDate) - formatDate(FilmA.releaseDate);
};

export const sortFilmByRating = (FilmA, FilmB) => {
  const weight = getWeightForNullDate(FilmA.totalRating, FilmB.totalRating);

  if (weight !== null) {
    return weight;
  }
  return FilmB.totalRating - FilmA.totalRating;
};

export const sortFilmByComments = (FilmA, FilmB) => {
  const weight = getWeightForNullDate(FilmA.comments.length, FilmB.comments.length);

  if (weight !== null) {
    return weight;
  }
  return FilmB.comments.length - FilmA.comments.length;
};

export const sortFilmById = (FilmA, FilmB) => {
  const weight = getWeightForNullDate(FilmA.id, FilmB.id);

  if (weight !== null) {
    return weight;
  }
  return FilmA.id - FilmB.id;
};
