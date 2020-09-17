import Abstract from './abstract';

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
    this._data.comments.push(update);
    this.updateElement();
  }

  deleteComment(index) {
    this._data.comments = [
      ...this._data.comments.slice(0, index),
      ...this._data.comments.slice(index + 1)
    ];
    this.updateElement();
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
