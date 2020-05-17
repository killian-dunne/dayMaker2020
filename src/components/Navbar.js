import React from 'react'
import { toggleSignup, toggleSignin } from '../utils/toggleSetup';
/* eslint-disable no-unused-expressions */

const Navbar = (props) => {
  let userPresent = props.user ? 'shown' : 'notShown';
  let userNotPresent = props.user ? 'notShown' : 'shown';
  let initials = '';
  if (props.user) {
    if (props.user.displayName) {
      let names = props.user.displayName.split(' ');
      initials = names[0][0].toUpperCase() + names[1][0].toUpperCase();
    } else {
      initials = props.user.email[0].toUpperCase();
    }
  }

  const signOut = () => {
    const auth = window._DEFAULT_DATA[0];
    auth.signOut();
  }

  return(
    <nav className="navbar navbar-expand-lg navbar-light bg-light" id="nav-bootstrap-overrides">
      <div className="row center navDiv">
        <img src="./img/logo.png" alt=":)" className="logo"/>
        <h1 className="heading">DayMaker</h1>
      </div>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="row center navDiv navbar-collapse collapse" id="navbarNav">
        <h5 className={`userState ${userNotPresent}`} onClick={toggleSignup}>Sign Up</h5>
        <h5 className={`userState ${userNotPresent}`} onClick={toggleSignin}>Sign In</h5>
        <button className={`btn btn-warning userIcon ${userPresent}`}>{initials}</button>
        <h5 className={`userState ${userPresent}`} onClick={signOut}>Sign Out</h5>
        <form className="form-inline">
          <input type="search" className="form-control mr-sm-2" placeholder="Search" />
          <button className="btn btn-outline-warning my-2 my-sm-0" type="submit">Search</button>
        </form>
      </div>
    </nav>
  );
}

// Insert user icon K.D. for example

export default Navbar;
