import Abstract from './abstract';
import {
  FilterType
} from '../const';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {
    type, name, count
  } = filter;

  const nameCondition = type !== FilterType.ALL
    ? `<span class="main-navigation__item-count" id="filter__${name}-count">
        ${count}
      </span>`
    : ``;

  return (
    `<a href="#${name}" class="main-navigation__item
      ${type === currentFilterType ? `main-navigation__item--active` : ``}"
      data-filter-type="${name}"
      >
        ${name}
        ${nameCondition}
      </a >`
  );
};

export const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join(``);

  return `<div class="main-navigation__items">
      ${filterItemsTemplate}
  </div>`;
};

export default class Filter extends Abstract {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
    if (document.querySelector(`.main-navigation__additional`)
      .classList.contains(`main-navigation__additional--active`)) {
      document.querySelector(`.main-navigation__additional`)
        .classList.remove(`main-navigation__additional--active`);
    }
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement()
      .addEventListener(`click`, this._filterTypeChangeHandler);
  }
}
