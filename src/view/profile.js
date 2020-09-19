import Abstract from './abstract';
import {
  ProfileRating
} from "../const";
export default class Profile extends Abstract {
  constructor(filmsCount) {
    super();
    this._filmsCount = filmsCount;
  }

  _setProfileRating() {
    let profileNickName;
    switch (true) {
      case (this._filmsCount >= 1 && this._filmsCount <= 10):
        profileNickName = ProfileRating.NOVICE;
        break;
      case (this._filmsCount >= 11 && this._filmsCount <= 20):
        profileNickName = ProfileRating.FAN;
        break;
      case (this._filmsCount >= 21):
        profileNickName = ProfileRating.MOVIE_BUFF;
        break;
      default:
        profileNickName = ``;
        break;
    }
    return profileNickName;
  }

  getTemplate() {
    return `<section class="header__profile profile">
      <p class="profile__rating">${this._setProfileRating()}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`;
  }
}
