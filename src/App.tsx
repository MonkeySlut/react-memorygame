import React, { useState } from 'react';
import './App.css';
import Grid from './Grid';

enum Team {
  red,
  blue
}
type teamNames = keyof typeof Team;
type gameScoreState = { [teamName in teamNames]: number };
type winnerState = teamNames | 'tie';

const gameScoreInitialState = {
  red: 0,
  blue: 0
};

const getRandomBoolean = () => Math.random() >= 0.5;

const App: React.FC = () => {
  const [winner, setWinner] = useState<winnerState>();
  const [gameScore, setGameScore] = useState<gameScoreState>(gameScoreInitialState);
  const [isRedTurn, setIsRedTurn] = useState(getRandomBoolean());

  const onSuccessfulMatch = () => {
    if (isRedTurn) {
      setGameScore(prevGameScore => ({ ...prevGameScore, red: prevGameScore.red + 10 }));
    } else {
      setGameScore(prevGameScore => ({ ...prevGameScore, blue: prevGameScore.blue + 10 }));
    }
  };

  const onFailedMatch = () => {
    setIsRedTurn(prevIsRedTurn => !prevIsRedTurn);
  };

  const onAllMatched = () => {
    let winner: winnerState;
    if (gameScore.blue === gameScore.red) {
      winner = 'tie';
    } else {
      winner = gameScore.blue > gameScore.red ? 'blue' : 'red';
    }
    setWinner(winner);
  };

  const onPlayAgain = () => {
    setWinner(undefined);
    setGameScore(gameScoreInitialState);
    setIsRedTurn(getRandomBoolean());
  };

  return (
    <div className="app">
      <div className="header">
        <div>
          {winner ? `The Winner is: ${winner}` : isRedTurn ? "Its Red Turn" : "Its Blue Turn"}
        </div>
        <div>
          {`Score - Red: ${gameScore.red}, Blue: ${gameScore.blue}`}
        </div>
      </div>
      {
        winner ? 
        <button className="playAgain" onClick={onPlayAgain}>Play Again</button> :
        <Grid onSuccessfulMatch={onSuccessfulMatch} onFailedMatch={onFailedMatch} onAllMatched={onAllMatched} />
      }
    </div>
  );
}

export default App;

