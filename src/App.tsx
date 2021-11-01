import React, { useState } from 'react';

import './App.css';
import BingoCardCell, { BINGO_CARD_CENTER, ShapeType } from './types/bingoTypes';
import generateBingoState from './utils/generateBingoState';

function App() {
  const [bingoRows, setBingoRows] = useState<Array<Array<BingoCardCell>>>(generateBingoState());

  const switchRowColStyle = (shape: ShapeType, index: number, activate: boolean): void => {
    const bingoRowsCopy = bingoRows.map((x: Array<BingoCardCell>) => x);

    if (shape === ShapeType.Row) {
      const rowToEdit: Array<BingoCardCell> = bingoRowsCopy[index].map((cell: BingoCardCell) => {
        return { ...cell, active: activate}
      });

      bingoRowsCopy[index] = rowToEdit;
    }

    if (shape === ShapeType.Column) {
      for (let i = 0; i < bingoRowsCopy.length; i++) {
        bingoRowsCopy[i][index].active = activate;
      }
    }

    setBingoRows(bingoRowsCopy);
  };

  const switchDiagsStyle = (indices: Array<Array<number>>, activate: boolean): void => {
    const bingoRowsCopy = bingoRows.map((x: Array<BingoCardCell>) => x);
    console.log(indices)

    indices.forEach((indexPair: Array<number>) => {
      bingoRows[indexPair[0]][indexPair[1]].active = activate;
    });

    setBingoRows(bingoRowsCopy);
  };
  
  const checkRowForScore = (rowIndex: number): boolean => {
    const rowAllCrossed = bingoRows[rowIndex].filter((cell: BingoCardCell) => cell.crossed).length === bingoRows[rowIndex].length;

    switchRowColStyle(ShapeType.Row, rowIndex, rowAllCrossed);

    return rowAllCrossed;
  };

  const checkColumnForScore = (colIndex: number): boolean => {
    let cellsInRowCrossed = 0;

    bingoRows.forEach((row: Array<BingoCardCell>) => {
      if (row[colIndex].crossed) {
        cellsInRowCrossed++;
      }
    });

    switchRowColStyle(ShapeType.Column, colIndex, cellsInRowCrossed === bingoRows.length);

    return cellsInRowCrossed === bingoRows.length;
  };

  const checkMainDiagonalsForScore = (rowIndex: number, colIndex: number): boolean => {
    let mainDiagCrossedCount = 0;
    const mainDiagIndices = [];
    let iterationDepth = 0;
    let rowIndexCopy = rowIndex;
    let colIndexCopy = colIndex;

    // Traverse main diagonal upwards
    if (!(rowIndexCopy === 0 && colIndexCopy === 0)) {
      while (true) {
        iterationDepth++;
        mainDiagIndices.push([rowIndexCopy, colIndexCopy]);
  
        if (bingoRows[rowIndexCopy][colIndexCopy].crossed) {
          mainDiagCrossedCount++;
        }
  
        if (rowIndexCopy === 0 || colIndexCopy === 0) break;
        rowIndexCopy--;
        colIndexCopy--;
      }
    }

    // Traverse main diagonal downwards
    // If cell is at the border somewhere, it means it has already been counted above.
    // So, only check the main diagonal downwards if the cell ISN'T located at the bottom row.
    if (rowIndex !== bingoRows.length - 1 && colIndex !== bingoRows.length - 1) {
      rowIndexCopy = rowIndex + 1;
      colIndexCopy = colIndex + 1;

      while (true) {
        iterationDepth++;
        mainDiagIndices.push([rowIndexCopy, colIndexCopy]);

        if (bingoRows[rowIndexCopy][colIndexCopy].crossed) {
          mainDiagCrossedCount++;
        }
  
        if (rowIndexCopy === bingoRows.length - 1 || colIndexCopy === bingoRows.length - 1) break;
        rowIndexCopy++;
        colIndexCopy++;
      }
    }

    switchDiagsStyle(mainDiagIndices, mainDiagCrossedCount === iterationDepth);

    return mainDiagCrossedCount === iterationDepth;
  };

  const checkSecondaryDiagonalForScore = (rowIndex: number, colIndex: number): boolean => {
    let secondaryDiagCrossedCount = 0;
    let iterationDepth = 0;
    let rowIndexCopy = rowIndex;
    let colIndexCopy = colIndex;

    // Traverse secondary diagonal downwards
    if (!(rowIndexCopy === 0 && colIndexCopy === 0)) {
      while (true) {
        iterationDepth++;
  
        if (bingoRows[rowIndexCopy][colIndexCopy].crossed) {
          secondaryDiagCrossedCount++;
        }
  
        if (rowIndexCopy === bingoRows.length - 1 || colIndexCopy === 0) break;
        rowIndexCopy++;
        colIndexCopy--;
      }
    }

    // Traverse secondary diagional upwards
    // If cell is at the border somewhere, it means it has already been counted above.
    // So, only check the secondary diagonal upwards if the cell ISN'T located at the far right column.
    if (!(colIndex === bingoRows.length - 1 && rowIndex === bingoRows.length - 1)) {
      rowIndexCopy = rowIndex;
      colIndexCopy = colIndex;

      while (true) {
        iterationDepth++;

        if (bingoRows[rowIndexCopy][colIndexCopy].crossed) {
          secondaryDiagCrossedCount++;
        }
  
        if (rowIndexCopy === 0 || colIndexCopy === bingoRows.length - 1) break;
        rowIndexCopy--;
        colIndexCopy++;
      }
    }

    if (iterationDepth > 1) {
      return secondaryDiagCrossedCount === iterationDepth;
    }

    return false;
  };

  const checkForScores = (rowIndex: number, colIndex: number): void => {
    checkRowForScore(rowIndex);
    checkColumnForScore(colIndex);
    checkMainDiagonalsForScore(rowIndex, colIndex);
    checkSecondaryDiagonalForScore(rowIndex, colIndex);
  };

  const handleSwitchCrossState = (rowIndex: number, colIndex: number): void => {
    const bingoRowsCopy = bingoRows.map((x: Array<BingoCardCell>) => x);

    bingoRowsCopy[rowIndex][colIndex].crossed = !bingoRowsCopy[rowIndex][colIndex].crossed;

    setBingoRows(bingoRowsCopy);

    checkForScores(rowIndex, colIndex)
  };

  let cellCount = 0;
  const rows = bingoRows.map((row: Array<BingoCardCell>, rowIndex: number) => {
    
    const cells = (
      <div id={`row-${rowIndex}`} key={`${rowIndex}-${Math.random()}`} className="bingo-row">
        {row.map((cell: BingoCardCell, colIndex: number) => {
          if (cell.phrase !== BINGO_CARD_CENTER) {
            cellCount++;
          }

          if (cell.phrase === BINGO_CARD_CENTER) {
            return (
              <button
                id={`${rowIndex}-${colIndex}`}
                key={`${colIndex}-${cell.id}`}
                disabled
                className="bingo-cell"
              >
                CONF CALL 😷 BINGO
              </button>
            );
          }

          return (
            <button
              id={`${rowIndex}-${colIndex}`}
              key={`${colIndex}-${cell.id}`}
              className={`bingo-cell ${cell.crossed ? 'cell-crossed' : ''} ${cell.active ? 'cell-active' : ''}`}
              onClick={() => handleSwitchCrossState(rowIndex, colIndex)}
            >
              <div className="bingo-cell-number">
                  {cellCount}
              </div>
              <div className="border-cell-text">
                {cell.phrase}
              </div>
            </button>);
        })}
      </div>
    );

    return cells;
  });

  return (
    <>
      <div>
        {rows}
      </div>
    </>
  );
}

export default App;
