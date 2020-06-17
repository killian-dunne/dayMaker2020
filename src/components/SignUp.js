import React from 'react'
import { toggleSignup, googleLogin } from '../utils/toggleSetup';

const SignUp = (props) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const firstName = form['signup-firstName'].value;
    const lastName = form['signup-lastName'].value;
    const email = form['signup-email'].value;
    const password = form['signup-password'].value;
    const auth = window._DEFAULT_DATA[0];
    const db = window._DEFAULT_DATA[1];
    auth.createUserWithEmailAndPassword(email, password)
      .catch(err => {
        console.log('There was an authentication error:');
        console.log(err.message);
      })
      .then(result => {
        form.reset();
        form.closest('#modal-signup').classList.remove('shown');
        db.collection('users').doc(result.user.uid).set({
          authLevel: 'basic',
          email,
        });
        return auth.currentUser.updateProfile({
          displayName: firstName + " " + lastName
        })
      }).then(another => {
        window.location.reload();
      })
      .catch(err => {
        console.log('There was a UX error:');
        console.log(err.message);
      })
  }

  return (
    <div id="modal-signup" className="modal user-state" onClick={toggleSignup}>
      <div className="modal-content">
        <h2>Sign up</h2>
        <form id="signup-form" onSubmit={handleSubmit}>
          <div className="input-field">
            <input type="text" id="signup-firstName" placeholder="First name"/>
          </div>
          <div className="input-field">
            <input type="text" id="signup-lastName" placeholder="Last name"/>
          </div>
          <div className="input-field">
            <input type="email" id="signup-email" placeholder="Email"/>
          </div>
          <div className="input-field">
            <input type="password" id="signup-password" placeholder="Password"/>
          </div>
          <img src={require('../googleLogin/web/2x/btn_google_signin_dark_normal_web@2x.png')} alt="Google Login" onClick={googleLogin}/>
          <button className="btn btn-outline-warning my-2 my-sm-0">Sign up</button>
        </form>
      </div>
    </div>
  )
}

export default SignUp
