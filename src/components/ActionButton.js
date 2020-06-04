import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faCheckSquare } from '@fortawesome/free-solid-svg-icons';


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
    if (tar.nodeName !== "button"){
      tar = tar.closest('button');
    }
    let hoverHeight = enter ? Math.max(tar.scrollHeight, height) : height;
    tar.setAttribute('style', `height: ${hoverHeight}px !important`);
    let textClass = Math.max(tar.scrollHeight, height) === height ? "keep" : "grow";
    tar.querySelector('.full-text').classList.toggle(textClass);
    console.log('set height to be :', hoverHeight)
  }

  return (
    <button className="action-button btn" style={{height: height +'px'}} onMouseEnter={e => setHoverHeight(e, true)} onMouseLeave={setHoverHeight}>
      <FontAwesomeIcon icon={faCheckSquare} size="1x" className="fa-icon action-icon action-check hvr-grow" onClick={e => this.props.editAction(e, this.props.id)}/>
      <FontAwesomeIcon icon={faEdit} size="1x" className="fa-icon action-icon action-edit hvr-rotate" onClick={e => this.props.editAction(e, this.props.id)}/>
      <FontAwesomeIcon icon={faTrash} size="1x" className="fa-icon action-icon action-trash hvr-buzz-out" onClick={e => this.props.removeAction(e, this.props.id)}/>
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
