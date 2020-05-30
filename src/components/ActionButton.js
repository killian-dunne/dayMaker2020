import React from 'react'

const ActionButton = (props) => {
  let buttonText;
  if (props.height > 14) {
    buttonText = props.text;
  } else {
    buttonText = "...";
  }
  return (
    <button className="action-button btn" style={{height: props.height +'px'}}>
      {buttonText}
    </button>
  )
}

export default ActionButton
