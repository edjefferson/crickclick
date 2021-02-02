import React from 'react';

const Scores = (props) => {
  const gameData = props.gameData
  return (
    <div id="scores" className="tab">
      <div id="totalruns">Lifetime runs: {gameData.totalRuns}</div>
      <div id="match">Match #<span id="matchcount">{gameData.matchCount}</span></div>
      <div>Score this match: <span id="runcount">{gameData.runCount} runs</span><span id="ballsfaced"> ({gameData.ballsFaced} balls faced)</span></div>
      <div id="highscores">
        <div className="highscore">Highest # of runs in a match:</div>
        <div className="highscorenum" id="highscoreruns">{gameData.highScoreRuns}</div>
      </div>
    </div>
  )

}


export default Scores;
