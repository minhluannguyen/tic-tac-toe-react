import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Board from './components/Board'
import ToggleButton from './components/ToggleButton';

function Game() {

  const [history, setHistory] = useState([
    { 
      squares: Array(9).fill(null),
      move: {
        x: null,
        y: null,
      }
    }
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [isNextX, setIsNextX] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [endGameRes, setEndGameRes] = useState([]);

  function handleClick(i) {
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.squares.slice();

    if (squares[i] || endGameRes.length !== 0) return;
    
    squares[i] = isNextX ? 'X' : 'O';
    
    let isWin = calculateWinner(squares);
    if (isWin) {
      setEndGameRes(isWin);
    }

    setHistory(newHistory.concat(
      [
        {
          squares,
          move: {
            x: Math.trunc(i / 3),
            y: i % 3
          }
        }
      ]
    ));
    setIsNextX(!isNextX);
    setStepNumber(stepNumber + 1);
  }

  function jumpTo(i) {
    setStepNumber(i);
    setIsNextX((i % 2) === 0);
    const current = history[i];
    const isWin = calculateWinner(current.squares);

    if (!isWin)
      setEndGameRes([]);
    else
      setEndGameRes(isWin);
  }

  function triggerToggle() {
    setToggle(!toggle)
  }

  function newGame() {
    jumpTo(0);
    setHistory([
      { 
        squares: Array(9).fill(null),
        move: {
          x: null,
          y: null,
        }
      }
    ]);
  }
  
  let move = history.map( (element, index) => {
    let x = element.move.x;
    let y = element.move.y;
    const desc = index ?
    `Go to move # ${index} ${history[index].squares[x*3+y]}(${x}, ${y})`:
    'Go to game start';

    return (
      <li key={index}>
        <button className={index === stepNumber? "selected":""} onClick={() => jumpTo(index)}>{desc}</button>
      </li>
    )
  });

  if (toggle) {
    move = move.reverse();
  }

  let status;
  if (endGameRes.length === 3) {
    status = "Winner: " + history[stepNumber].squares[endGameRes[0]];
  } else if (stepNumber === 9) {
    status = "It's a draw!"
  } else if (endGameRes) {
    status = "Next player: " + (isNextX? "X" : "O");
  }
  
  return (
    <div className="game">
      <h1>TIC TAC TOE</h1>

      <div className="game-main">
        <div className="game-board">
          <h2 className="status">{status}</h2>
          <Board 
            current={history[stepNumber]}
            endGameRes={endGameRes}
            onClick={ i => handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div className="toogle-button">
            <ToggleButton toggle={toggle} onChange={() => triggerToggle()}/>
            <p>{toggle? "Descending" : "Ascending"}</p>
          </div>
          <ol>{move}</ol>
        </div>
      </div>

      <div className="new-game">
        <button onClick={newGame}>New Game</button>
      </div>
    </div>
  )
}


ReactDOM.render(
  <Game/>,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}