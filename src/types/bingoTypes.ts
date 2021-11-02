interface BingoCardCell {
  id: number;
  phrase: string;
  crossed: boolean;
  active: boolean;
  partOfStructure: boolean;
};

export enum ShapeType {
  Row = 'Row',
  Column = 'Column',
  MainDiagonal = 'MainDiagonal',
  SecondaryDiagonal = 'SecondaryDiagonal'
};

export const BINGO_CARD_CENTER = 'BINGO_CARD_CENTER';

export default BingoCardCell;