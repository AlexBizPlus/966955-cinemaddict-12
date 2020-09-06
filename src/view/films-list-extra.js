import Abstract from './abstract';

export default class FilmsListExtra extends Abstract {
  getTemplate() {
    return `<section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
    </section>`;
  }
}
