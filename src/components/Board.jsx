import React from 'react'
import '../style/board.css'
import Square from './Square';

function Board({current, endGameRes, onClick}) {

  function renderSquare(i) {
    let isSelect = false;
    if (i === endGameRes[0] || i === endGameRes[1] || i === endGameRes[2])
      isSelect = true;
    else if (current.move.x === (Math.trunc(i / 3)) && current.move.y === (i % 3))
      isSelect = true;
    
    return (
      <Square key={i} isSelect={isSelect} value={current.squares[i]} onClick={() => onClick(i) }></Square>
    )
  }

  function createBoard() {
    let res = [];
    for(let i = 0; i < 3; i++) {
      let rowSquare = [];
      for(let j = 0; j < 3; j++) {
        let square = renderSquare(i*3 + j);
        rowSquare.push(square);
      }
      res.push(<div key={i} className="boardRow">{rowSquare}</div>);
    }
    return (
      <>
      { res }
      </>
    );
  }

  return (
    <div className="board">
      { createBoard() }
    </div>
  )
}

export default Board;