import Abstract from './abstract';
import Api from "../api.js";
import {
  BackendValues
} from "../const";

const api = new Api(BackendValues.END_POINT, BackendValues.AUTHORIZATION);
export default class Smart extends Abstract {

  updateData(update) {
    if (!update) {
      return;
    }
    this._data = Object.assign({}, this._data, update);
    this.updateElement();
  }

  updateComments(update) {
    if (!update) {
      return;
    }
    api.updateComments(this._data.id, update)
      .then((comments) => {
        delete this._data.comments;
        this._data.comments = comments;
      })
      .then(() => this.updateElement())
      .catch(() => {
        this.shake(this.updateElement.bind(this));
      });
  }

  deleteComment(number) {
    const id = number.split(`-`)[0];
    const index = number.split(`-`)[1];
    api.deleteComment(id)
      .then(() => this._data.comments.splice(index, 1))
      .then(() => this.updateElement())
      .catch(() => {
        this.shake(this.updateElement.bind(this));
      });
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);
    prevElement = null;
    this.restoreHandlers();
  }
}
