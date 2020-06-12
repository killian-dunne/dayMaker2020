import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { convertHeightToTime } from '../utils/dateStuff';
import { setAction } from '../utils/dbStuff';

const ActionBox = (props) => {
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
    let top = box.style.top;
    if (box.parentNode.querySelector(':hover') === box) {
      box.classList.add('hovered');
    } else {
      box.classList.remove('hovered');
    }
    let increment = 20;
    if (height < 14) {
      textArea.classList.toggle('hide');
      ellipArea.classList.toggle('hide');
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

  const completeAction = e => {
    let box = e.target.closest('.action-box');
    let textArea = box.querySelector('.inline');
    textArea.classList.add('completed');
    box.classList.add('faded');
    let classes = ['hvr-grow', 'hvr-rotate', 'hvr-buzz-out'];
    box.querySelectorAll('svg').forEach(icon => {
      classes.forEach(myClass => {
        if (icon.classList.contains(myClass)) {
          icon.classList.remove(myClass);
        }
      });
    });
  }

  const handleSelect = e => {
    let box = e.target.closest('.action-box');
    if (box && !e.target.closest('.action-icon')) {
      box.classList.toggle('selected');
    }
  }

  const handleDownClick = eA => {
    console.log('downclick called')
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
          clickedBox.classList.remove('dragging');
          handleSelect(eA); // cancel(/duplicate) toggle select
        }
        document.body.onmousemove = document.body.onmouseup = null;
      };
    }
  }

  return (
    <div id={props.id} className="action-box" style={{height: height +'px'}} onClick={handleSelect} onMouseDown={handleDownClick} onMouseEnter={e => setHoverHeight(e, true)} onMouseLeave={setHoverHeight}>
      <div className="action-icon action-check fa-icon" onClick={completeAction}>
        <FontAwesomeIcon icon={faCheckSquare} size="1x" className="hvr-grow"/>
      </div>
      <div className="action-icon action-edit fa-icon" onClick={e => props.editAction(e, props.id)}>
        <FontAwesomeIcon icon={faEdit} size="1x" className="hvr-rotate"/>
      </div>
      <div className="action-icon action-trash fa-icon" onClick={e => props.removeAction(e, props.id)}>
        <FontAwesomeIcon icon={faTrash} size="1x" className="hvr-buzz-out"/>
      </div>
      <div className={`full-text ${hideA}`}>
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
  )
}

export default ActionBox
