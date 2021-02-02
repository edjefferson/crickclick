const BallCounter = (props) => {
  return  Array.apply(null, { length: props.balls }).map((e, i) => (
        <svg key={"ball" + i} className="ball" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50"/>
        </svg>
      ));
}

export default BallCounter;
