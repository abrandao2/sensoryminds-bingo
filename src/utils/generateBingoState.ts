import shuffleArray from "./shuffleArray";
import BingoCardCell from "../types/bingoTypes";
import { BINGO_CARD_CENTER } from "../types/bingoTypes";

const generateBingoState = () => {
  const phrases = [
    'child noises in the background',
    'Hello, hello?',
    'i need to jump in another call',
    'can everyone go on mute',
    'could you please get closed to the mic',
    '(load painful echo / feedback)',
    'Next slide, please.',
    'can we take this offline?',
    'is ___ on the call?',
    'Could you share this slides afterwards?',
    'can somebody grant presenter rights?',
    'can you email that to everyone?',
    'sorry, i had problems loging in',
    '(animal noises in the background)',
    'sorry, i didn\'n found the conference id',
    'i was having connection issues',
    'i\'ll have to get back to you' ,
    'who just joined?',
    'sorry, something ___ with my calendar',
    'do you see my screen?',
    'lets wait for ___!',
    'You will send the minutes?',
    'sorry, i was on mute.',
    'can you repeat, please?',
    BINGO_CARD_CENTER
  ];

  const phrasesShuffled = shuffleArray(phrases);
  const newBingoState: Array<Array<BingoCardCell>> = [];
  let bingoRow: Array<BingoCardCell> = [];

  for (let i = 0; i < phrasesShuffled.length; i++) {
  
    // If it's the center of the bingo card, then it should always be marked as crossed
    bingoRow.push({
      id: i,
      phrase: phrasesShuffled[i],
      crossed: phrasesShuffled[i] === BINGO_CARD_CENTER,
      active: false,
      partOfStructure: false
    });

    if (bingoRow.length === 5) {
      newBingoState.push(bingoRow);

      bingoRow = [];
    }
  }

  return newBingoState;
};

export default generateBingoState;