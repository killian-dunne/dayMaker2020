import React, { useState } from 'react'
import { toggleSignup, toggleSignin } from '../utils/toggleSetup';
import { getPlanByDate } from '../utils/dbStuff';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import logo from '../img/logo.png';

const Navbar = (props) => {
  let [search, setSearch] = useState('');
  let userPresent = props.user ? 'shown' : 'notShown';
  let userNotPresent = props.user ? 'notShown' : 'shown';
  let initials = '';
  if (props.user) {
    if (props.user.displayName) {
      let names = props.user.displayName.split(' ');
      if (names.length > 1) {
        initials = names[0][0].toUpperCase() + names[1][0].toUpperCase();
      } else {
        initials = names[0][0].toUpperCase();
      }

    } else {
      initials = props.user.email[0].toUpperCase();
    }
  }
  var buttonEnable = true;
  if (props.user) {
    buttonEnable = false;
  }

  const signOut = () => {
    const auth = window._DEFAULT_DATA[0];
    auth.signOut();
  }

  const handleSearch = async e => {
    e.preventDefault();
    let planID = await getPlanByDate(search);
    props.scrollToPlan(planID);
  }

  return(
    <nav className="navbar navbar-expand-lg navbar-light bg-light" id="nav-bootstrap-overrides">
      <div className="row center navDiv">
        <img src={logo} alt=":)" className="logo"/>
        <h1 className="heading">DayMaker</h1>
      </div>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="row center navDiv navbar-collapse collapse" id="navbarNav">
        <h5 className={`user-state ${userNotPresent}`} onClick={toggleSignup}>Sign Up</h5>
        <h5 className={`user-state ${userNotPresent}`} onClick={toggleSignin}>Sign In</h5>
        <button className={`btn btn-warning userIcon ${userPresent}`}>{initials}</button>
        <h5 className={`user-state ${userPresent}`} onClick={signOut}>Sign Out</h5>
        <form className="form-inline" onSubmit={handleSearch}>
          <DatePicker selected={search} onSelect={date => setSearch(date)} className="form-control mr-sm-2" placeholderText="03-Jun-20" dateFormat="d-MMM-yy"/>
          <button className="btn btn-outline-warning my-2 my-sm-0" disabled={buttonEnable} type="submit">Search</button>
        </form>
      </div>
    </nav>
  );
}

export default Navbar;
