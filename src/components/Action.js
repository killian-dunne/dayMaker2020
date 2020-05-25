import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun } from '@fortawesome/free-solid-svg-icons'

class Action extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      times: ["00:00", "01:00"],
      plan: props.plan,
      completed: false
    };
  }

  render () {
    return(
      <div>
        <FontAwesomeIcon icon={faSun} /> Action 1
      </div>
    );
  }
}

export default Action;
//<p>Day</p>
//<p>Date</p>
