import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faCheckSquare } from '@fortawesome/free-solid-svg-icons';

const ActionBox = (props) => {
  // let size = props.height < 14 ? "small" : "normal";
  let height = props.height;
  if (height < 14) {
    var [hideA, hideB] = ["hide", ""];
  } else {
    var [hideA, hideB] = ["", "hide"];
  }


  const setHoverHeight = (e, enter) => {
    let box = e.target.closest('.action-box');
    let textArea = box.querySelector('.full-text');
    let ellipArea = box.querySelector('.ellipsis');
     // Get things
    // let textClass = height > textArea.scrollHeight ? "keep" : "grow";

    box.classList.toggle('hovered'); // Hover button

    if (height < 14) {
      textArea.classList.toggle('hide');
      ellipArea.classList.toggle('hide');
      box.setAttribute('style', `height: ${box.scrollHeight + 10}px !important`);
    } else {
      box.setAttribute('style', `height: ${textArea.scrollHeight + 10}px !important`);
    }
    if (!enter || height > textArea.scrollHeight) {

      box.setAttribute('style', `height: ${height}px !important`);
    }

    // textArea.classList.toggle(textClass);
  }

  const completeAction = e => {
    let box = e.target.closest('.action-box');
    let textArea = box.querySelector('.inline');
    textArea.classList.add('completed');
    box.classList.add('faded');
  }

  return (
    <div className="action-box" style={{height: height +'px'}} onMouseEnter={e => setHoverHeight(e, true)} onMouseLeave={setHoverHeight}>
      <div className="action-icon action-check fa-icon">
        <FontAwesomeIcon icon={faCheckSquare} size="1x" className="hvr-grow" onClick={completeAction}/>
      </div>
      <div className="action-icon action-edit fa-icon">
        <FontAwesomeIcon icon={faEdit} size="1x" className="hvr-rotate" onClick={e => this.props.editAction(e, this.props.id)}/>
      </div>
      <div className="action-icon action-trash fa-icon">
        <FontAwesomeIcon icon={faTrash} size="1x" className="hvr-buzz-out" onClick={e => this.props.removeAction(e, this.props.id)}/>
      </div>
      <div className={`full-text ${hideA}`}>
        <div className="inline">
          {props.text}
        </div>
      </div>
      <div className={`ellipsis ${hideB}`}>
        ...
      </div>
    </div>
  )
}

export default ActionBox
