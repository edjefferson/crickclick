import BallCounter from './BallCounter'

const Pitch = (props) => {

   
    let gameData = props.gameData


    const clickText = () => {
      if (props.gameState === 0) {
        return "CLICK TO RECIEVE BALL"
      } else
      if (props.gameState === 1) {
        return "CLICK TO HIT" 
      }
      if (props.gameState === 2) {
        let larrow = "< "
        let rarrow = " >"
        return (<><span style={{width: "5%"}}>{larrow}</span><span>CLICK TO RUN</span><span style={{width: "5%"}}>{rarrow}</span></>)
      } else
      if (props.gameState === 3) {
        return "RUNNING"
      } else
      if (props.gameState === 4) {
        return "CLICK FOR NEXT BALL"
      }
  
    }
    const getPlayerPos = (player) => {
        
        return {
            left: (gameData.batters[player].direction === 1 ? 0 : 1 *16.5)+61.75*gameData.batters[player].pos/1000 + "%"
        }
        
    }
    const getAnimationFrame = (pos) => {
      let newPos = Math.round((pos * 5 % 100) / 10) + 1
      
      return newPos > 10 ? 10 : newPos 
    }
      //$("#batterimg" + (player+1)).css("transform","scaleX("+  ( -1) + ")")
   
return   <>
<div id="leftwicket">
{gameData.bowlDirection === -1 ? (
<>
<div id="ballcounter">
    <BallCounter balls={props.gameData.ballCount} />
   
</div>
<div id="overs">Over {props.gameData.overCount}</div>
</>
) : null}
</div>

<div id="pitch" style={{transform: "scaleX(" + gameData.bowlDirection + ")"}}>
    <div id="mainpscore">{gameData.totalRuns}</div>

    <div id="pscore">{gameData.runCount}</div>
    <div id="creasel" className="crease"></div>
    <div id="creaser" className="crease"></div>
    <div id="batter1" className="batter"style={getPlayerPos(0)}>
        <div className="battername" style={{transform: "scaleX(" + gameData.bowlDirection + ")"}}>{props.gameData.playerName.toUpperCase()}</div>
        <img id="batterimg1" src={"runanim/r" + getAnimationFrame(gameData.batters[0].pos) + ".svg"} alt="batsman 1" style={{transform: "scaleX(" + gameData.batters[0].direction + ")"}}/>
    </div>
    <div id="batter2" className="batter"style={getPlayerPos(1)}>
        <div className="battername" id="ianname" style={{transform: "scaleX(" + gameData.bowlDirection + ")"}}>{props.ianName.toUpperCase()}</div>
        <img id="batterimg2" src={"runanim2/r" + getAnimationFrame(gameData.batters[1].pos) + ".svg"} alt="batsman 2" style={{transform: "scaleX(" + gameData.batters[1].direction + ")"}}/>
    </div>
    <div id="pitchtextcontainer">
    <div id="pitchtext">{clickText()}</div>
    </div>
</div>
<div id="clickarea" onMouseDown={props.pitchClick}></div>

<div id="rightwicket">
    {gameData.bowlDirection === 1 ? (
    <>
    <div id="ballcounter">
        <BallCounter balls={ gameData.ballCount } />
    </div>
    <div id="overs">Over {gameData.overCount}</div>
    </>
    ) : null}
</div>

</>
}

export default Pitch;
