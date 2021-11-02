import React, { useState } from 'react';

import './App.css';
import BingoCardCell, { BINGO_CARD_CENTER } from './types/bingoTypes';
import generateBingoState from './utils/generateBingoState';

function App() {
  const [bingoRows, setBingoRows] = useState<Array<Array<BingoCardCell>>>(generateBingoState());
  const [message, setMessage] = useState('');
  const [mainDiagonalCrossed, setMainDiagonalCrossed] = useState(false);
  const [secondaryDiagonalCrossed, setSecondaryDiagonalCrossed] = useState(false);

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

  const switchCellsStyle = (indices: Array<Array<number>>, activate: boolean, calledBy: string): void => {
    const bingoRowsCopy = bingoRows.map((x: Array<BingoCardCell>) => x);
    console.log(indices, activate, calledBy)

    // indices.forEach((indexPair: Array<number>) => {
    //   if (!bingoRowsCopy[indexPair[0]][indexPair[1]].partOfStructure) {
    //     bingoRowsCopy[indexPair[0]][indexPair[1]].active = activate;
    //     bingoRowsCopy[indexPair[0]][indexPair[1]].partOfStructure = activate;
    //   } else {
    //     bingoRowsCopy[indexPair[0]][indexPair[1]].active = activate;
    //   }
    // });

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

    switchCellsStyle(indices, cellsInRowCrossedCount === bingoRows.length, 'checkRow');

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

    switchCellsStyle(indices, cellsInColCrossedCount === bingoRows.length, 'checkCol');

    return cellsInColCrossedCount === bingoRows.length;
  };

  const checkMainDiagonalForScore = (): boolean => {
    let mainDiagCellsCrossedCount = 0;
    const indices: number[][] = [];

    bingoRows.forEach((row: Array<BingoCardCell>, index: number) => {
      if (row[index].crossed) {
        mainDiagCellsCrossedCount++;
        
      }
      
      indices.push([index, index]);
    });

    if (!mainDiagonalCrossed) {
      if (mainDiagCellsCrossedCount === bingoRows.length) {
        setMessage('You\'ve scored the main diagonal!');
        setMainDiagonalCrossed(true);
      } else {
        setMainDiagonalCrossed(false);
      }
    }

    switchCellsStyle(indices, mainDiagCellsCrossedCount === bingoRows.length, 'checkMainDiag');

    return mainDiagCellsCrossedCount === bingoRows.length;
  };

  const checkSecondaryDiagonalForScore = (): boolean => {
    let secDiagCellsCrossedCount = 0;
    const indices: number[][] = [];

    bingoRows.forEach((row: Array<BingoCardCell>, index: number) => {
      if (row[(bingoRows.length - 1) - index].crossed) {
        secDiagCellsCrossedCount++;
      }

      indices.push([index, index]);
    });

    if (!secondaryDiagonalCrossed) {
      if (secDiagCellsCrossedCount === bingoRows.length) {
        setMessage('You\'ve scored the secondary diagonal!');
        setSecondaryDiagonalCrossed(true);
      } else {
        setSecondaryDiagonalCrossed(false);
      }
    }

    switchCellsStyle(indices, secDiagCellsCrossedCount === bingoRows.length, 'checkSecDiag');

    return secDiagCellsCrossedCount === bingoRows.length;
  };

  const checkForScores = (rowIndex: number, colIndex: number): void => {
    checkRowForScore(rowIndex);
    checkColumnForScore(colIndex);
    checkMainDiagonalForScore();
    checkSecondaryDiagonalForScore();
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
