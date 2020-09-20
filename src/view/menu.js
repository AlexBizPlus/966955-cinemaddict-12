import Abstract from './abstract';
export default class Menu extends Abstract {

  getTemplate() {
    return `<nav class="main-navigation" style="display: none">
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`;
  }
}
