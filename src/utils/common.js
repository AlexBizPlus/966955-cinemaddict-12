import {
  EnterKeycode
} from "../const";

export const isEscPressed = (evt) => {
  return (evt.key === `Escape` || evt.key === `Esc`)
    ? true
    : false;
};

export const isCtrlEnterPressed = (evt) => {
  return ((evt.ctrlKey || evt.metaKey) && (evt.keyCode === EnterKeycode.first || evt.keyCode === EnterKeycode.second))
    ? true
    : false;
};
