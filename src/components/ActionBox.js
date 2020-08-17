import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { convertHeightToTime } from '../utils/dateStuff';

const ActionBox = (props) => {
  const actionBox = useRef(null);
  let height = props.height;
  if (props.startTime && parseInt(props.startTime.substring(3)) === 0) {
    height ++;
  }
  var [hideA, hideB] = ["", ""];
  if (height < 16) {
    [hideA, hideB] = ["hide", ""];
  } else {
    [hideA, hideB] = ["", "hide"];
  }
  let midSize = (height > 16 && height < 30) ? "mid-height" : "";
  let overlap = props.overlap ? 'overlap' : '';

  useEffect(() => {
    if (props.completed) {
      toggleCompleted();
    }
  }, [])

  const setHoverHeight = (e, enter) => {
    let box = e.target.closest('.action-box');
    let textArea = box.querySelector('.full-text');
    let ellipArea = box.querySelector('.ellipsis');
    let top = box.style.top;
    if (box.parentNode.querySelector(':hover') === box) {
      box.classList.add('hovered');
    } else {
      box.classList.remove('hovered');
    }
    let increment = 20;
    if (height < 16) {
      if (box.parentNode.querySelector(':hover') === box) {
        textArea.classList.remove('hide');
        ellipArea.classList.add('hide');
      } else {
        textArea.classList.add('hide');
        ellipArea.classList.remove('hide');
      }
      box.setAttribute('style', `height: ${box.scrollHeight + increment}px !important`);
    } else if (height < 50) {
      increment = 30;
      box.setAttribute('style', `height: ${textArea.scrollHeight + increment}px !important`);
    } else {
      increment = 10;
      box.setAttribute('style', `height: ${textArea.scrollHeight + increment}px !important`);
    }
    if (!enter || height > textArea.scrollHeight +  increment) {

      box.setAttribute('style', `height: ${height}px !important`);
    }
    box.style.top = top;
  }
 
  const toggleCompleted = e => {
    let box;
    if (e) {
      e.stopPropagation();
      box = e.target.closest('.action-box');
    } else {
      box = actionBox.current;
    }
    let textArea = box.querySelector('.inline');
    let completing = !textArea.classList.contains('completed');
    textArea.classList.toggle('completed');
    box.classList.toggle('faded');
    box.querySelectorAll('svg').forEach(icon => { // remove animations on icons
      if (icon.classList.contains('check-icon')) icon.classList.toggle('hvr-grow');
      if (icon.classList.contains('edit-icon')) icon.classList.toggle('hvr-rotate');
      if (icon.classList.contains('delete-icon')) icon.classList.toggle('hvr-buzz-out');
    });
    props.addOrUpdateAction(undefined, undefined, undefined, props.planID, completing, props.id);
  }

  const selectOrComplete = e => {
    e.persist();
    e.stopPropagation();
    let box = e.target.closest('.action-box');
    if (box.classList.contains('faded')) {
      toggleCompleted(e);
    } else {
      handleSelect(e);
    }
  }

  const handleSelect = e => {
    e.stopPropagation();
    let box = e.target.closest('.action-box');
    if (box && !e.target.closest('.action-icon')) {
      box.classList.toggle('selected');
    }
  }

  const handleDownClick = eA => {
    eA.persist();
    let clickedBox = eA.target.closest('.action-box');
    if (eA.button === 0 && clickedBox && !eA.target.closest('.action-icon') && clickedBox.classList.contains('selected')) {
      let start = eA.clientY, offset = clickedBox.offsetTop, end = eA.clientY;
      let allActions = document.querySelectorAll('.action-box');
      let planActionIds = props.plan.actions.map(action => action.id);
      let allOffsets = [];
      clickedBox.classList.add('dragging');
      allActions.forEach(actionBox => {
        allOffsets.push(actionBox.offsetTop);
      });

      document.body.onmousemove = eB => {
        end = eB.clientY;
        for (let i = 0; i < allActions.length; i++) {
          if (planActionIds.includes(allActions[i].id) && allActions[i].classList.contains('selected')) {
            allActions[i].style.top = (allOffsets[i] + end - start) + 'px';
          }
        }
      };
      document.body.onmouseup = eC => {
        if (Math.abs(end - start) < 5) { // If barely dragged
          clickedBox.style.top = offset + 'px'; // return to original position
        } else {
          for (let actionBox of allActions) {
            if (planActionIds.includes(actionBox.id) && actionBox.classList.contains('selected')) {
              let completed = actionBox.classList.contains('completed');
              let [prevStartTime, prevEndTime] = actionBox.querySelector('.action-times').textContent.split("-");
              let [newStartTime, newEndTime] = [convertHeightToTime(prevStartTime, end - start), convertHeightToTime(prevEndTime, end - start)];
              let text = actionBox.querySelector('.full-text').querySelector('.inline').textContent;
              props.addOrUpdateAction(text, newStartTime, newEndTime, props.planID, completed, actionBox.id);
              if (actionBox !== clickedBox) {
                actionBox.classList.remove('selected');
              }
            }
          }
          handleSelect(eA); // cancel(/duplicate) toggle select
        }
        clickedBox.classList.remove('dragging');
        document.body.onmousemove = document.body.onmouseup = null;
      };
    }
  }

  return (
    <div  id={props.id} 
          className={`action-box ${overlap}`} 
          style={{height: height + 'px'}} 
          onClick={selectOrComplete} 
          onMouseDown={handleDownClick} 
          onMouseEnter={e => setHoverHeight(e, true)} 
          onMouseLeave={setHoverHeight}
          ref={actionBox}>
      <div className="gen-writing">
        <div className="action-icon action-check fa-icon" onClick={toggleCompleted}>
          <FontAwesomeIcon icon={faCheckSquare} size="1x" className="check-icon hvr-grow"/>
        </div>
        <div className="action-icon action-edit fa-icon" onClick={e => props.editAction(e, props.id)}>
          <FontAwesomeIcon icon={faEdit} size="1x" className="edit-icon hvr-rotate"/>
        </div>
        <div className="action-icon action-trash fa-icon" onClick={e => props.removeAction(e, props.id)}>
          <FontAwesomeIcon icon={faTrash} size="1x" className="delete-icon hvr-buzz-out"/>
        </div>
        <div className={`full-text ${hideA} ${midSize}`}>
          <div className="inline">
            {props.text}
          </div>
        </div>
        <div className={`ellipsis ${hideB}`}>
          ...
        </div>
        <div className="action-times">
          {props.startTime}-{props.endTime}
        </div>
      </div>
    </div>
  )
}

export default ActionBox
