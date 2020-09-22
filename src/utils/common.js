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

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomElement = (items) => {
  const randomElement = getRandomInteger(0, items.length - 1);
  return items[randomElement];
};

export const getNewRandomElement = (items, count) => {
  const results = [];
  const newItems = items.slice(``);

  for (let i = 0; i < count; i++) {
    const randomElement = getRandomElement(0, newItems.length - 1);
    const index = newItems.findIndex((elem) => elem === randomElement);
    const result = newItems.splice(index, 1)[0];
    results.push(result);
  }

  return results;
};
