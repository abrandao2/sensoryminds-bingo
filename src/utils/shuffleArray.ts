import { BINGO_CARD_CENTER } from "../types/bingoTypes";

// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
const shuffleArray = (array: Array<string>): Array<string> => {
  // Create copy of array to prevent strange sideeffects
  const arrayCopy = array.map((x: string) => x);

  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }

  // Find BING_CARD_CENTER const's current position
  const centerConstIndex = arrayCopy.indexOf(BINGO_CARD_CENTER);

  // Swap the current center value for the constant
  const valueAtCenterOfCard = arrayCopy[12];
  arrayCopy[12] = BINGO_CARD_CENTER;
  arrayCopy[centerConstIndex] = valueAtCenterOfCard;

  return arrayCopy;
};

export default shuffleArray;
