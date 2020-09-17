export const humanizeTaskDueDate = (dueDate) => {
  return dueDate.toLocaleString(`en-US`, {
    day: `numeric`, month: `long`, year: `numeric`
  });
};

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

export const sortFilmByDate = (FilmA, FilmB) => {
  const weight = getWeightForNullDate(FilmA.releaseDate, FilmB.releaseDate);

  if (weight !== null) {
    return weight;
  }

  return FilmB.releaseDate.getTime() - FilmA.releaseDate.getTime();
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
