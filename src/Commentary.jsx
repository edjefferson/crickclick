import React from 'react';

const Commentary = (props) => {


return (
<div id="commentary" className="tab">
<div id="latest-update">{props.updates[0]}</div>
<div id="history">{
  props.updates.map((u,i) => { return i > 0 ? 
     (<div key={i} className='old-comment'>{u}</div>) : null
})}
</div>
</div>)
}

export default Commentary;
