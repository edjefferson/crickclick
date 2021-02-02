import React from 'react';

const Commentary = (props) => {


return (
<div id="commentary" className="tab">
<div id="latest-update">{props.updates[0]}</div>
<div id="history">{
  props.updates.map((u,i) => { if (i > 0) {
    return (<div key={i} className='old-comment'>{u}</div>)

  }
  })
}</div>
</div>)
}

export default Commentary;
