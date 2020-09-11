import Profile from './view/profile';
import Menu from './view/menu';
import Stat from './view/stat';
import FilmSection from './presenter/film-section';
import {
  generateMockFilm
} from './mock/films';
import {
  render,
} from './utils/render';
import {
  FilmSettings
} from './const';

const mockFilmList = new Array(FilmSettings.FILMS_COUNT).fill().map(generateMockFilm);
const mockFilmExtraList = new Array(FilmSettings.EXTRA_COUNT).fill().map(generateMockFilm);
const mockFilmMostList = new Array(FilmSettings.MOST_COUNT).fill().map(generateMockFilm);

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footerStatContainer = document.querySelector(`.footer__statistics`);

const profile = new Profile();
render(header, profile);

const menu = new Menu(mockFilmList);
render(main, menu);

const filmSection = new FilmSection(main);
filmSection.init(mockFilmList, mockFilmExtraList, mockFilmMostList);

const footerStat = new Stat(FilmSettings.FILMS_COUNT);
render(footerStatContainer, footerStat);
