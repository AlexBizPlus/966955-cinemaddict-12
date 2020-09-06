import Abstract from './abstract';
export default class Stat extends Abstract {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return `<p>${this._count} movies inside</p>`;
  }
}
