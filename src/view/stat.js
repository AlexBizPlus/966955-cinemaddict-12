import Abstract from './abstract';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';
import Profile from '../view/profile';
import {
  CHAR_BAR_HEIGHT
} from "../const";

export default class Stat extends Abstract {
  constructor(films) {
    super();
    this._films = films;
    this._pref = {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: [`Sci-Fi`, `Animation`, `Fantasy`, `Comedy`, `TV Series`],
        datasets: [{
          data: [11, 8, 7, 4, 3],
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `#ffe800`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            offset: 40,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 24
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    };
    this._checked = false;
    this._currentFilter = `statistic-all-time`;

    this._clickHandler = this._clickHandler.bind(this);
    this._changeInputHandler = this._changeInputHandler.bind(this);

    this._changeStatTimeClickHandler();
  }

  _getGenresMap(films = this._films) {
    let totalRuntime = 0;
    const genres = new Map();
    films.forEach((film) => {
      if (film.genre.length > 0) {
        film.genre.forEach((genre) => {
          if (!genres.has(genre)) {
            genres.set(genre, Object.assign({
              time: new Array(1).fill(Object.assign({}, {
                runtime: film.runtimeUnformated,
                watchingDate: film.watchingDateUnformated
              }))
            }));
          } else {
            const key = genres.get(genre);
            key.time.push(Object.assign({}, {
              runtime: film.runtimeUnformated,
              watchingDate: film.watchingDateUnformated
            }));
          }
        });
      }
      totalRuntime += film.runtimeUnformated;
    });
    this._genres = genres;
    this._genres.count = genres.size;
    this._genres.totalRuntime = moment.utc(moment.duration(totalRuntime, `minutes`).asMilliseconds()).format(`HH mm`);
  }

  _getGenresCount() {
    return Array.from(this._genres.values()).map((item) => item.time.length);
  }

  myChart() {
    const statisticCtx = document.querySelector(`.statistic__chart`);
    statisticCtx.setAttribute(`height`, `${CHAR_BAR_HEIGHT * this._genres.count}`);

    this._pref = Object.assign({}, this._pref, {
      data: Object.assign({}, this._pref.data, {
        labels: Array.from(this._genres.keys()),
        datasets: [{
          data: this._getGenresCount(),
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `#ffe800`,
          anchor: `start`
        }]
      })
    });

    return new Chart(statisticCtx, this._pref);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    if (this._checked) {
      return;
    }
    this._checked = true;
    this._callback.click();
    this._buttonElement.classList.add(`main-navigation__additional--active`);
  }

  _createCanvas() {
    Array.from(document.
      querySelector(`.statistic__chart-wrap`).children)
      .map((item) => item.remove());
    const newCanvas = document.createElement(`canvas`);
    newCanvas.classList.add(`statistic__chart`);
    newCanvas.setAttribute(`width`, `1000`);
    document.querySelector(`.statistic__chart-wrap`)
      .append(newCanvas);
  }

  _setTextToHtml(id, text) {
    const elem = document.getElementById(`${id}`);
    elem.textContent = ``;
    elem.insertAdjacentHTML(`afterBegin`, `${text}`);
  }

  _changeInputHandler(evt) {
    evt.preventDefault();
    if (evt.target.id === this._currentFilter) {
      return;
    }
    this._createCanvas();

    switch (evt.target.id) {

      case `statistic-today`:
        if (!this._films.today) {
          this._films.today = this._getFilms(this._films, 24, `h`);
        }
        this._getGenresMap(this._films.today);
        this._setTextToHtml(`totalWachedFilms`, `${this._getTotalWachedFilms(this._films.today)} <span class="statistic__item-description">movies</span>`);
        this._currentFilter = `statistic-today`;
        break;

      case `statistic-week`:
        if (!this._films.week) {
          this._films.week = this._getFilms(this._films, 7, `d`);
        }
        this._getGenresMap(this._films.week);
        this._setTextToHtml(`totalWachedFilms`, `${this._getTotalWachedFilms(this._films.week)} <span class="statistic__item-description">movies</span>`);
        this._currentFilter = `statistic-week`;
        break;

      case `statistic-month`:
        if (!this._films.month) {
          this._films.month = this._getFilms(this._films, 1, `M`);
        }
        this._getGenresMap(this._films.month);
        this._setTextToHtml(`totalWachedFilms`, `${this._getTotalWachedFilms(this._films.month)} <span class="statistic__item-description">movies</span>`);
        this._currentFilter = `statistic-month`;
        break;

      case `statistic-year`:
        if (!this._films.year) {
          this._films.year = this._getFilms(this._films, 1, `y`);
        }
        this._getGenresMap(this._films.year);
        this._setTextToHtml(`totalWachedFilms`, `${this._getTotalWachedFilms(this._films.year)} <span class="statistic__item-description">movies</span>`);
        this._currentFilter = `statistic-year`;
        break;

      default:
        this._getGenresMap();
        this._setTextToHtml(`totalWachedFilms`, `${this._getTotalWachedFilms(this._films)} <span class="statistic__item-description">movies</span>`);
        this._currentFilter = `statistic-all-time`;
        break;
    }

    this._setTextToHtml(`totalRuntime`, this._getTotalRuntime(this._genres.totalRuntime));
    this._setTextToHtml(`topGenre`, this._getTopGenre());

    this.myChart();
  }

  setStatClickHandler(callback) {
    this._callback.click = callback;
    this._buttonElement = document.querySelector(`.main-navigation__additional`);
    this._buttonElement
      .addEventListener(`click`, this._clickHandler);
  }

  _changeStatTimeClickHandler() {
    this.getElement()
      .querySelector(`.statistic__filters`)
      .addEventListener(`change`, this._changeInputHandler);
  }

  _getProfileStatus() {
    this._profile = new Profile(this._films.length);
  }

  _getTotalRuntime(time) {
    return `${time.split(` `)[0]} <span class= "statistic__item-description"> h</span> ${time.split(` `)[1]} <span class= "statistic__item-description"> m</> `;
  }

  _getTotalWachedFilms(films) {
    return films.length;
  }

  _getFilms(films, number, key) {
    const date = moment().add(-number, `${key}`).format(`YYYYMMDDHHmm`);

    const newFilms = [];
    films.forEach((film) => {
      if (moment(new Date(film.watchingDateUnformated)).format(`YYYYMMDDHHmm`) >= date) {
        newFilms.push(film);
      }
    });

    return newFilms;
  }

  _getTopGenre() {
    const max = Math.max.apply(null, this._getGenresCount());
    const index = this._getGenresCount().findIndex((elem) => elem === max);

    return index >= 0 ? Array.from(this._genres.keys())[index] : ``;
  }

  getTemplate() {
    this._getGenresMap();
    this._getProfileStatus();
    this._getTopGenre();

    return `<section class= "statistic" >
        <p class="statistic__rank">
          Your rank
           <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
            <span class="statistic__rank-label">${this._profile._setProfileRating()}</span>
        </p>

          <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
            <p class="statistic__filters-description">Show stats:</p>

            <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
              <label for="statistic-all-time" class="statistic__filters-label">All time</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
                <label for="statistic-today" class="statistic__filters-label">Today</label>

                <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
                  <label for="statistic-week" class="statistic__filters-label">Week</label>

                  <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
                    <label for="statistic-month" class="statistic__filters-label">Month</label>

                    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
                      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

                    <ul class="statistic__text-list">
                      <li class="statistic__text-item">
                        <h4 class="statistic__item-title">You watched</h4>
                        <p class="statistic__item-text" id="totalWachedFilms">${this._getTotalWachedFilms(this._films)} <span class="statistic__item-description">movies</span></p>
                      </li>
                      <li class="statistic__text-item">
                        <h4 class="statistic__item-title">Total duration</h4>
                        <p class="statistic__item-text" id="totalRuntime">${this._getTotalRuntime(this._genres.totalRuntime)}</p>
                      </li>
                      <li class="statistic__text-item">
                        <h4 class="statistic__item-title">Top genre</h4>
                        <p class="statistic__item-text" id="topGenre">${this._getTopGenre()}</p>
                      </li>
                    </ul>

                    <div class="statistic__chart-wrap">
                      <canvas class="statistic__chart" width="1000"></canvas>
                    </div>

  </section>`;
  }
}
