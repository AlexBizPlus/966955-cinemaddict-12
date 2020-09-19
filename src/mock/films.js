
/*import {
  getRandomInteger
} from '../utils/common';
import {
  nanoid
} from 'nanoid';

const postersPathes = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

const descriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.Sed sed nisi sed augue convallis suscipit in sed felis.Aliquam erat volutpat.Nunc fermentum tortor ac porta dapibus.In rutrum ac purus sit amet tempus.`
];

const ages = [
  `6`, `12`, `18`, `21`
];

const genres = [
  `Drama`, `Film-Noir`, `Mystery`
];

const people = [
  `Anthony Mann`, `Anne Wigton`, `Heinz Herald`, `Richard Weil`, `Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`
];

const countryList = [
  `USA`, `Canada`, `Australia`, `Japan`
];

const emojis = [
  `angry`, `puke`, `sleeping`, `smile`
];

const getRandomElement = (someArray) => {
  const randomElement = getRandomInteger(0, someArray.length - 1);
  return someArray[randomElement];
};

const getTitleOfFilm = (path) => {
  let name = path.split(`/`)[3].split(`.`)[0].split(`-`).join(` `);
  name = name[0].toUpperCase() + name.slice(1);
  return name;
};

const getRandomRating = () => {
  return getRandomInteger(40, 90) / 10;
};

const getRandomDate = () => {
  return new Date(getRandomInteger(1929, 1948), 3, 1, 0, 0, 0, 0);
};

const getRandomRuntime = () => {
  return `1h ${getRandomInteger(10, 59)}m`;
};

const getRandomGenres = () => {
  let count = getRandomInteger(1, 3);
  const index = getRandomInteger(0, 2);
  let randomGenres = [];
  switch (count) {
    case 3:
      randomGenres = randomGenres.concat(genres);
      break;
    case 2:
      randomGenres = randomGenres.concat(genres);
      count = randomGenres.splice(index, 1);
      break;
    case 1:
      randomGenres.push(genres[index]);
      break;
  }

  return randomGenres;
};

export const getRandomComment = () => {
  return {
    comment: getRandomElement(descriptions),
    emoji: getRandomElement(emojis),
    author: getRandomElement(people),
    day: `2019/${getRandomInteger(1, 12)}/${getRandomInteger(1, 31)} ${getRandomInteger(0, 23)}:59`
  };
};

export const generateMockFilm = () => {
  const poster = `./images/posters/${getRandomElement(postersPathes)}`;
  const title = getTitleOfFilm(poster);

  return {
    id: nanoid(10),
    poster,
    title,
    description: getRandomElement(descriptions),
    totalRating: getRandomRating(),
    releaseDate: getRandomDate(),
    runtime: getRandomRuntime(),
    genre: getRandomGenres(),
    comments: new Array(getRandomInteger(1, 5)).fill().map(getRandomComment),
    currentComment: {
      comment: null,
      emoji: null,
      author: null,
      day: null
    },
    age: `${getRandomElement(ages)}+`,
    director: getRandomElement(people),
    writers: `${getRandomElement(people)} ${getRandomElement(people)}`,
    actors: `${getRandomElement(people)} ${getRandomElement(people)}`,
    country: getRandomElement(countryList),
    isWatchlist: Boolean(getRandomInteger(0, 1)),
    isHistory: Boolean(getRandomInteger(0, 1)),
    isFavorites: Boolean(getRandomInteger(0, 1)),
  };
};
*/
