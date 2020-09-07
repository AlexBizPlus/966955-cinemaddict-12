import Abstract from './abstract';
export default class FilmsList extends Abstract {
  constructor() {
    super();
  }

  getTemplate() {
    return `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>`;
  }
}
