import Abstract from './abstract';

export default class FilmsListMost extends Abstract {
  getTemplate() {
    return `<section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
    </section>`;
  }
}
