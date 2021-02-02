import React, {useState} from 'react';


const Paper = (props) => {
  const [hidePaper,setHidePaper] = useState(props.hidePaper)

  const hideButtonClick = () => {
    setHidePaper(true)
    props.closePaper()
  }

  const paperStyle = () => {
    return {
      position: "absolute",
      fontFamily: "PT Serif",
      zIndex: 999,
      backgroundColor: "#fbfbf8",
      border: "1px #d7d7b8 solid",
      width: "100%",
      display: hidePaper ? "none" : "block",
    };
  }

  const lorem = () => {return {
    width: "90%",
    marginBottom: "0.5em",
    backgroundColor: "darkgray",
    color: "darkgray"

  }
}

  return  (
    <div id="paper" style={paperStyle()}>
      <div style={{
        fontSize: "1em",
        width: "100%",
        textAlign: "center"
      }}>The Big News</div>
      <div style={{
        position: "relative",
        height: "8em"
      }}>
      <div style={{
                position: "absolute",
        fontSize: "1.5em",
        width: "70%",
        textAlign: "left"
      }}>World Cup postponed after new cuboid football causes injuries.
      
      <div style={{
        
        fontSize: "0.8em",
        textAlign: "left"
      }}>Page 32</div>
      </div>
      
      <div style={{
                        position: "absolute",

        fontSize: "4em",
        right: 0,
        width: "30%",
        textAlign: "centre"
      }}>Sport</div></div>
      <h3 style= {{
        fontSize: "3em",
        padding: 0,
      }}
      >New cricket player's first match!</h3>
      <div style={{position:"relative",
     height: "16em"}}>
      <div style={{
        position:"absolute",
        width: "33%",
        left: "0%"
        
        }}>
      <img style={{
        width: "90%",
        backgroundColor: "lightgreen",


      }}  src="player.svg" />
      <div>Everyone is so excited!</div>
      </div>
      <div
         style={{
          position:"absolute",
          width: "33%",
          left: "33%"
          
          }}
      >
        <div style={lorem()}>Lorem impsum</div>
        <div style={lorem()}>Lorem impsum</div>
        <div style={lorem()}>Lorem impsum</div>
        <div style={lorem()}>Lorem impsum</div>
        <div style={lorem()}>Lorem impsum</div>
        <div style={lorem()}>Lorem impsum</div>
        <div style={lorem()}>Lorem impsum</div>
        <button onClick={hideButtonClick} style={{
          fontFamily: "Dosis",
          fontWeight: "bold",
          width: "100%",
          fontSize: "1.5em"
        }}>Click To Continue</button>
      </div>
      <div style={{
          position:"absolute",
          width: "33%",
          left: "66%"
          
          }}
          >
          <div style={lorem()}>Lorem impsum</div>
          <div style={lorem()}>Lorem impsum</div>
          <div style={lorem()}>Lorem impsum</div>
          <div style={lorem()}>Lorem impsum</div>
          <div style={lorem()}>Lorem impsum</div>
          <div style={lorem()}>Lorem impsum</div>

          <div style={lorem()}>Lorem impsum</div>

        </div>
   

      </div>
    </div>
  )
}

export default Paper;
