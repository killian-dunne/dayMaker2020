import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun } from '@fortawesome/free-solid-svg-icons'

class Action extends React.Component {
  render () {
    return(
      <div>
        <FontAwesomeIcon icon={faSun} /> Action 1
        <p>Time</p>
      </div>
    );
  }
}

export default Action;
//<p>Day</p>
//<p>Date</p>
