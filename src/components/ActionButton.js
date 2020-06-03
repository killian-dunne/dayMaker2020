import React, { useEffect } from 'react'

const ActionButton = (props) => {
  let [hideA, hideB] = ["hide", "hide"];
  if (props.height > 14) {
      hideA = "";
      hideB = "hide";
  } else {
    hideB = "";
    hideA = "hide";
  }
  let height = props.height;


  const setHoverHeight = (e, enter) => {
    let tar = e.target;
    let hoverHeight = enter ? Math.max(tar.scrollHeight, height) : height;
    tar.setAttribute('style', `height: ${hoverHeight}px !important`);
    console.log('set height to be :', hoverHeight)
  }

  return (
    <button className="action-button btn" style={{height: height +'px'}} onMouseEnter={e => setHoverHeight(e, true)} onMouseLeave={setHoverHeight}>
      <div className={`full-text ${hideA}`}>
        {props.text}
      </div>
      <div className={`ellipsis ${hideB}`}>
        ...
      </div>
    </button>
  )
}

export default ActionButton
