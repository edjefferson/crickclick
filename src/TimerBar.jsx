import React, { useState } from 'react';

const TimerBar = (props) => {

  const [frameStartLength, setFrameStartLength] = useState(0)
  const maxTimerWidth = () => {
    return props.gameState >= 2 ? 10000 : props.gameData.timerLength
  }

  const timerWidth = () => {
    
    let percent = 100 * (Date.now() - props.gameData.startTime)/props.gameData.timerLength
    if (percent >= 100) percent = 100
    return percent
    
  }

  const frameWidth = () => {
    let startSpeed = 4
    let time = (Date.now() - props.gameData.startTime)/1000
    if (!frameStartLength) setFrameStartLength(Math.random()*50)
    let frameWidth = frameStartLength + 20 * startSpeed * time - 0.8 * time ** 2

    if (frameWidth <= 100 * props.gameData.timerLength/maxTimerWidth()) {
      return frameWidth
    } else {
      return 100 * props.gameData.timerLength/maxTimerWidth()
    }
  }

  const calculateRunSegment = (run) => {
    let runWidth
    if (run.complete) {
      runWidth = 100* (run.endtime-run.starttime)/maxTimerWidth() + "%"
    } else
    if (props.gameData.timeLeft <= 0) {
      runWidth = 100* (props.gameData.timerLength-run.starttime)/maxTimerWidth() + "%"
    }
    else
    {
      runWidth = 100* (Date.now()-run.starttime)/maxTimerWidth() + "%"
    }

    return {left: 100* (run.starttime - props.gameData.startTime  )/maxTimerWidth() + "%", width: runWidth}
    
    
  }

  return (
    <div id="timercontainer">
      { props.gameState === 1 || props.gameState === 2 || props.gameState === 3? (<>
    <div id="timer" style={{width: 100 * props.gameData.timerLength/maxTimerWidth() + "%"}}>
      
      
     { props.gameState < 2 ? <div id="timerball" style={{left: timerWidth() * 0.98 + "%"}}><svg className="timerballsvg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50"/>
        </svg></div> : <div id="timerbar" style={{width: timerWidth() + "%"}}></div>
      }

    </div>
    <div id="runbar">
    {
        Object.values(props.gameData.batters[1].currentRuns).reverse().map((r,i) => {
          return <div key={i} className='runsegment runsegmentp1' style={calculateRunSegment(r)}></div>
        })
      }

      {
        Object.values(props.gameData.batters[0].currentRuns).reverse().map((r,i) => {
          return <div key={i} className='runsegment runsegmentp0' style={calculateRunSegment(r)}></div>
        })
      }



    </div>
    <div id="timerframe" style={{
      width: props.gameState >= 2 ? frameWidth() + "%" : "100%",
      display: props.gameState !==  0 ? "block" : "none"
      }}></div>

</> ) : null}
  </div>
  )
}



export default TimerBar;
