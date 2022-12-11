// TODO...
// DEAL WITH HISCORE DISPLAY AND LOCAL STORAGE
// make score set at first game and lowest score wins after that. how do i set initial score?
// dots on die
// track time and high score, again localStorage

/************************************************************************ */

import { useState, useEffect } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "./Confetti";

function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [score, setScore] = useState(0);
  const [highscore, setHighscore] = useState(0);

  useEffect(() => {
    if (!tenzies) {
      const json = JSON.stringify(highscore);
      localStorage.setItem("highscore", json);
      setScore(0);
    } else {
      if (highscore > 0) {
        if (score < highscore) {
          setHighscore(score);
          setScore(0);
        }
      } else {
        setHighscore(score);
        setScore(0);
      }
    }
  }, [tenzies]);

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const sameValues = dice.every((die) => die.value === firstValue);
    if (allHeld && sameValues) {
      setTenzies(true);
    }
  }, [dice]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const diceArr = [];
    for (let i = 0; i < 10; i++) {
      diceArr.push(generateNewDie());
    }
    return diceArr;
  }

  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setScore((score) => score + 1);
    } else {
      setDice(allNewDice());
      setTenzies(false);
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceMap = dice.map((die) => {
    return (
      <Die
        value={die.value}
        key={die.id}
        isHeld={die.isHeld}
        holdDice={() => holdDice(die.id)}
      />
    );
  });

  function clearHighscore() {
    localStorage.clear();
  }

  return (
    <div className="main">
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.<br></br>
        <br></br>Lowest Score Wins
      </p>
      <div className="die-container">{diceMap}</div>
      <button onClick={rollDice} className="roll-btn">
        {tenzies ? "New Game" : "Roll"}
      </button>
      <div className="score-display">
        <h3 className="high-score">Highscore: {highscore}</h3>
        <h3 className="current-score">Score: {score}</h3>
      </div>
      <button onClick={clearHighscore} className="clear-highscore">
        Clear Highscore
      </button>
    </div>
  );
}

export default App;
