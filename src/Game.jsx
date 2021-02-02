import React, { useEffect, useState, useRef } from 'react';
import Pitch from './Pitch'
import TimerBar from './TimerBar'
import Commentary from './Commentary'
import Scores from './Scores'
import Paper from './Paper'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const gameStates = {
  0: "ready2hit",
  1: "ballhit",
  2: "ready2run",
  3: "running",
  4: "endofball"
}
const initialData = () => {
  if (!cookies.get("crickclick")) {
    return {
      playerName: "You",
      lastAchievement: 0,
      batters: [
        {
          end: 0,
          status: 0,
          pos: 0,
          currentRuns: [],
          direction: 1
        },
        {
          end: 1,
          status: 0,
          pos: 1000,
          currentRuns: [],
          direction: -1
        }],
      hittingAccuracy: 0,
      hittingForce: 0,
      team: 0,
      speed: 0,
      inBat: 0,
      startTime: null,
      timerLength: null,
      timeLeft: null,
      ianNo: 0,
      bowlDirection: 1,
      matchCount: 1,
      overCount: 1,
      overRuns: 0,
      ballCount: 1,
      ballRunCount: 0,
      runCount: 0,
      totalRuns: 0,
      ballsFaced: 0,
      unusedPoints: 0,
      totalPointsBought: 0,
      highScoreRuns: 0
    }
  } else {
    let gameData = cookies.get("crickclick")
    let batters = [
      {
        end: 0,
        status: 0,
        pos: 0,
        currentRuns: [],
        direction: 1
      },
      {
        end: 1,
        status: 0,
        pos: 1000,
        currentRuns: [],
        direction: -1
      }
    ]
    batters = gameData.inBat ? batters.reverse() : batters
    return {...gameData, batters: batters}
  }
}
const ians = [
  "Ian",
  "Iain",
  "Iaiin",
  "Iaiiin",
  "Iivan",
  "Ivan",
  "Ivian",
  "Iviian",
  "Ixian",
  "Ixan"
]

const useAnimationFrame = callback => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef();
  const previousTimeRef = useRef();

  
  useEffect(() => {
      
    const animate = time => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime)
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    }
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [callback]); // Make sure the effect runs only once
}

const Game = () => {
  const [gameData, setGameData] = useState(initialData());
  const [gameState, setGameState] = useState(0)
  const [selectedTab, setSelectedTab] = useState("tcommentary")

  const [commentaryUpdates,setCommentaryUpdates] = useState([])

  const timePerStep = 2000/16
  const stepsPerRun = 16
  
  const NPtimePerStep = 2000
  const NPStepsPerRun = 1


  useAnimationFrame(deltaTime => {
    loopCycle()
  })

 

  const generateTimer = (hittingForceLevel) => {
    return 500 + Math.random() * 4500
  }
  
  const commentaryUpdate = (update) => {
    setCommentaryUpdates(commentaryUpdates => [update,...commentaryUpdates])
  }

  const playerIsInGround = (player) => {
    return (gameData.batters[player].end === 1 && gameData.batters[player].pos === 1000) || (gameData.batters[player].end === 0 && gameData.batters[player].pos === 0)
  }

  const youreOut = (player) => {
    let newGameData = {runCount: 0}
    if (player === 0) {
      commentaryUpdate("You are out.")
      newGameData.overCount = 1
      newGameData.ballCount = 0
      newGameData.matchCount = gameData.matchCount + 1
    } else {
      commentaryUpdate(ians[gameData.ianNo] + " is out.")
      newGameData.ianNo = gameData.ianNo + 1
    }

   
    setGameData(gameData => {
      return {...gameData, ...newGameData}
    })
  }

  const loopCycle = () => {
    let timeLeft = gameData.timerLength - (Date.now() - gameData.startTime)
    let newGameData = {timeLeft: timeLeft}
    let completeRuns
    cookies.set("crickclick",JSON.stringify(gameData))
    if (gameState === 2 || gameState === 3) {
      if (timeLeft <= 0) {
        setGameState(4)
        completeRuns = gameData.batters.map( x => x.currentRuns.filter( f => f.complete ).length )

        if (!playerIsInGround(0) && !playerIsInGround(1)) {
          let batterDists =  gameData.batters.map((b) => {return b.end ? 1000 - gameData.batters[0].pos : gameData.batters[0].pos })
          youreOut(batterDists[0] > batterDists[1] ? 0 : 1)
        } else 
        if (!playerIsInGround(0)) {
          youreOut(0)
        } else
        if (!playerIsInGround(1)) {
          youreOut(1)
        } else
        if (gameData.batters[0].pos === gameData.batters[1].pos) {
           youreOut(completeRuns[0] < completeRuns[1] ? 0 : 1)
        }
        else {
          let runs = completeRuns.sort((a,b) =>  {return a - b} )[0]
          if (runs) {
            commentaryUpdate("You scored " + runs + " runs!")
            newGameData = {...newGameData,
              runCount: runs + gameData.runCount,
              totalRuns: runs + gameData.totalRuns,
              inBat: gameData.batters[0].end
            }
          }
        }

      } else {
        doRuns(0,stepsPerRun,timePerStep)
        nonPlayerRunCheck(1)
        doRuns(1,NPStepsPerRun,NPtimePerStep)
      }
    }
    setGameData(gameData => {
      return {...gameData, ...newGameData}
    })
    
  }

  const playerHasSameOrMoreRunsAsNonPlayer = () => {
    return gameData.batters[1].currentRuns.filter(x => x.complete).length <= gameData.batters[0].currentRuns.filter(x => x.complete).length
  }

  const timeToCompleteARun = (leeway) => {
    return gameData.timeLeft > leeway + timePerStep * stepsPerRun
  }
  const nonPlayerRunCheck = (player) => {
    if (gameData.batters[player].status === 0 && playerHasSameOrMoreRunsAsNonPlayer() && (timeToCompleteARun(500)  || gameData.batters[0].status === 1)) {
      run(player,gameData.batters[player].direction,NPtimePerStep)
    }

  }

  const goToNextBall = () => {
    
    setGameData(gameData => { 



      let newBallCount, newOverCount
      if (gameData.ballCount === 6) {
        newBallCount = 1
        newOverCount = gameData.overCount + 1

      } else {
        newBallCount = gameData.ballCount + 1
        newOverCount = gameData.overCount
      }

      
      let batters = [
        {
          end: 0,
          status: 0,
          pos: 0,
          currentRuns: [],
          direction: 1
        },
        {
          end: 1,
          status: 0,
          pos: 1000,
          currentRuns: [],
          direction: -1
        }]
        batters = gameData.inBat ? batters.reverse() : batters
      return {...gameData, batters: batters, ballCount: newBallCount, overCount: newOverCount}
    })
  }

  const run = (player,direction,runTime) => {
    setGameData(gameData => {
      let batters = [...gameData.batters]

      if (!(batters[player].pos === 0 && direction === -1) && !(batters[player].pos === 1000 && direction === 1)) {
        if (player === 0) setGameState(3)

        if (!batters[player].currentRuns.slice(-1)[0] || batters[player].currentRuns.slice(-1)[0].complete) {
          batters[player].currentRuns.push({starttime: Date.now(), direction: direction, originalPos: batters[player].pos, endtime: Date.now(), complete: false})
        }
        if (batters[player].pos === 0) batters[player].end = 1
        if (batters[player].pos === 1000) batters[player].end = 0

        let newRun = batters[player].currentRuns.slice(-1)[0]
        newRun.originalPos = batters[player].pos
        newRun.direction = direction
        newRun.endtime = Date.now() + runTime
        batters[player].status = 1
        batters[player].currentRuns.pop()
        batters[player].currentRuns.push(newRun)
      }

      
      return {...gameData, batters: batters}

    })
  }

  const addRuns = (gameData,runs) => {
    gameData.runCount += runs
    gameData.totalRuns += runs
    return gameData
  }

  const doRuns = (player,stepsPerRun,runTime) => {
    let runDistance = Math.ceil(1000/stepsPerRun)

    setGameData(gameData => {
      let batters = [...gameData.batters]

      if (batters[player].currentRuns.slice(-1)[0] && !batters[player].currentRuns.slice(-1)[0].complete) {
        
        let newRun = batters[player].currentRuns.slice(-1)[0]
        let currentTime = runTime - (newRun.endtime - Date.now())

        batters[player].pos = newRun.originalPos + runDistance * currentTime/runTime * newRun.direction
        if (newRun.direction === 1 && batters[player].pos >= newRun.originalPos + runDistance) {
          batters[player].pos = newRun.originalPos + runDistance
          setGameState(2)
        } else
        if (newRun.direction === -1 && batters[player].pos <= newRun.originalPos - runDistance) {
          batters[player].pos = newRun.originalPos - runDistance
          setGameState(2)

        }
        batters[player].direction = newRun.direction

        if (batters[player].pos >= 1000) {
          if (batters[player].end === 1) {
            newRun.complete = true
            batters[player].status = 0
          }
          batters[player].pos = 1000
          batters[player].direction = -1
        } else 
        if (batters[player].pos <= 0) {
          if (batters[player].end === 0) {
            newRun.complete = true
            batters[player].status = 0
          }
          batters[player].pos = 0
          batters[player].direction = 1
        }
        
      

      } 
      return {...gameData, batters: batters, runCount: gameData.runCount }

    })
  }

  

  const hitBall = (player) => {
      let newGameData = {
        startTime: Date.now(),
        timerLength: generateTimer(gameData.hittingForce)
      }

      setGameState(2)
      if (gameData.inBat) {
        commentaryUpdate(ians[gameData.ianNo] + "'s hit the ball, run?")
      } else {
        commentaryUpdate("You've hit the ball, run?")
      }
      setGameData( gameData => { return {...gameData,...newGameData} })
        
  }

  const bowlBall = () => {
    let newGameData = {
      startTime: Date.now(),
      ballsFaced: gameData.inBat ? gameData.ballsFaced + 1 : gameData.ballsFaced,
      timerLength: generateTimer(gameData.hittingForce)
    }
    setGameState(1)
    setGameData( gameData => { return {...gameData,...newGameData} })
  }

  const pitchClick = (e) => {
    let bounds = e.target.getBoundingClientRect()
    let xPos = (e.clientX - bounds.x)/e.target.clientWidth
    //let yPos = (e.clientY - bounds.Y)/e.target.clientHeight
    if (gameState === 0) {
      bowlBall()
    }
    if (gameState === 1) {
      hitBall(0)
    } else
    if (gameState === 2) {
      let direction = xPos < 0.5 ? -1 : 1
      run(0,direction,timePerStep)
    } else
    if (gameState === 4) {
     
      
      setGameState(0)
      goToNextBall()
    } 

  }

  const tabSelect = (e) => {
    setSelectedTab(e.target.id)
  }

  const tabContents = () => {
  
    if (selectedTab === "tcommentary") {
      return (<Commentary updates={commentaryUpdates} />)
    } else
    if (selectedTab === "tscores" ) {
      return (<Scores gameData={gameData}/>)
    } else
    if (selectedTab === "tupgrades") {
      return (<div style={{color: "white"}}>upgrades go here</div>)
    } else
    if (selectedTab === "tachievements") {
      return (<div style={{color: "white"}}>achievements go here</div>)
    }
  }

  const closePaper = () => {
    setGameData(
      gameData => {return {
        ...gameData, lastAchievement: gameData.lastAchievement + 1
      } }
    )
  }
    
  return  (<>        <div id="titlebar">CrickClick</div>
    <Paper closePaper={closePaper} hidePaper={gameData.lastAchievement > 0 ? true : false}/>
    <div id="playarea" >
      <Pitch gameData={gameData} pitchClick={pitchClick} gameState={gameState} playerName={"You"} ianName={ians[gameData.ianNo]} />
      <TimerBar gameData={gameData} gameState={gameState} />

    </div>
<div id="tabs">
<div id="tabselect">
  {[["tcommentary","C"],["tscores","S"],["tupgrades","U"],["tachievements","A"]].map( x => {
    let tclass = x[0] === selectedTab ? "tselectb selectedtab" : "tselectb"
    return (<div id={x[0]} key={x[0]} onMouseDown ={tabSelect} className={tclass}>{x[1]}</div>)
  }

  )}
  
</div>
  <div id="tabcontainer">
  {tabContents()}
   
</div>
</div>

   
   


  
  
  <button id="resetgame">RESET GAME</button>
  </>
)
}

export default Game;
