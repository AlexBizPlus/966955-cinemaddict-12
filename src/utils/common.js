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

export const getRandomElement = (someArray) => {
  const randomElement = getRandomInteger(0, someArray.length - 1);
  return someArray[randomElement];
};

export const getNewRandomElement = (someArray, count) => {
  const results = [];
  const newArray = someArray.slice(``);

  for (let i = 0; i < count; i++) {
    const randomElement = getRandomElement(0, newArray.length - 1);
    const index = newArray.findIndex((elem) => elem === randomElement);
    const result = newArray.splice(index, 1)[0];
    results.push(result);
  }

  return results;
};
