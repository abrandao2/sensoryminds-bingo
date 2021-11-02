import React, { useState } from 'react';

import './App.css';
import BingoCardCell, { BINGO_CARD_CENTER } from './types/bingoTypes';
import isCornerCell from './utils/array';
import generateBingoState from './utils/generateBingoState';

function App() {
  const [bingoRows, setBingoRows] = useState<Array<Array<BingoCardCell>>>(generateBingoState());
  const [message, setMessage] = useState('');

  React.useEffect(() => {
    const timeOutId = window.setTimeout(() => {
      setMessage('');
    }, 2000);

    return () => window.clearTimeout(timeOutId);
  }, [message]);

  const setScoreMessage = (message: string): void => {
    setMessage(message);
    
    setTimeout(() => {
      setMessage('');
    }, 2000);
  };

  const switchDiagsStyle = (indices: Array<Array<number>>, activate: boolean): void => {
    const bingoRowsCopy = bingoRows.map((x: Array<BingoCardCell>) => x);

    indices.forEach((indexPair: Array<number>) => {
      if (!bingoRowsCopy[indexPair[0]][indexPair[1]].partOfStructure) {
        bingoRowsCopy[indexPair[0]][indexPair[1]].active = activate;
        bingoRowsCopy[indexPair[0]][indexPair[1]].partOfStructure = activate;
      } else {
        bingoRowsCopy[indexPair[0]][indexPair[1]].active = activate;
      }
    });

    setBingoRows(bingoRowsCopy);
  };
  
  const checkRowForScore = (rowIndex: number): boolean => {
    let cellsInRowCrossedCount = 0;
    const indices: number[][] = [];


    bingoRows[rowIndex].forEach((cell: BingoCardCell, colIndex: number) => {
      if (cell.crossed) {
        cellsInRowCrossedCount++;
        indices.push([rowIndex, colIndex]);
      }
    });

    switchDiagsStyle(indices, cellsInRowCrossedCount === bingoRows.length);

    if (cellsInRowCrossedCount === bingoRows.length) {
      setScoreMessage('You\'ve scored a row!');
    }

    return cellsInRowCrossedCount === bingoRows.length;
  };

  const checkColumnForScore = (colIndex: number): boolean => {
    let cellsInColCrossedCount = 0;
    const indices: number[][] = [];

    bingoRows.forEach((row: Array<BingoCardCell>, rowIndex: number) => {
      if (row[colIndex].crossed) {
        cellsInColCrossedCount++;
        indices.push([rowIndex, colIndex]);
      }
    });

    if (cellsInColCrossedCount === bingoRows.length) {
      setMessage('You\'ve scored a column!');
    }

    switchDiagsStyle(indices, cellsInColCrossedCount === bingoRows.length);

    return cellsInColCrossedCount === bingoRows.length;
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
    
    if (!isCornerCell(`${rowIndex},${colIndex}`, bingoRows.length - 1)) {
      switchDiagsStyle(mainDiagIndices, mainDiagCrossedCount === iterationDepth);
      setMessage('You\'ve scored a main diagonal!');

      return mainDiagCrossedCount === iterationDepth;
    }

    return false;
  };

  const checkSecondaryDiagonalForScore = (rowIndex: number, colIndex: number): boolean => {
    let secondaryDiagCrossedCount = 0;
    let iterationDepth = 0;
    const secondaryDiagIndices = [];
    let rowIndexCopy = rowIndex;
    let colIndexCopy = colIndex;

    // Traverse secondary diagonal downwards
    if (!(rowIndexCopy === 0 && colIndexCopy === 0)) {
      while (true) {
        iterationDepth++;
        secondaryDiagIndices.push([rowIndex, colIndex]);
  
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
        secondaryDiagIndices.push([rowIndex, colIndex]);

        if (bingoRows[rowIndexCopy][colIndexCopy].crossed) {
          secondaryDiagCrossedCount++;
        }
  
        if (rowIndexCopy === 0 || colIndexCopy === bingoRows.length - 1) break;
        rowIndexCopy--;
        colIndexCopy++;
      }
    }

    if (!isCornerCell(`${rowIndex},${colIndex}`, bingoRows.length - 1)) {
      switchDiagsStyle(secondaryDiagIndices, secondaryDiagCrossedCount === iterationDepth);
      setMessage('You\'ve scored a secondary diagonal!');

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

  const handleSwitchCrossedState = (rowIndex: number, colIndex: number): void => {
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
              onClick={() => handleSwitchCrossedState(rowIndex, colIndex)}
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
      {message
      ? (
        <div className="message">
          {message}
        </div>
      ) : null}
      <div>
        {rows}
      </div>
    </>
  );
}

export default App;
