import React from 'react'
import { toggleSignin, googleLogin } from '../utils/toggleSetup';

const SignIn = (props) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target
    const email = form['signin-email'].value;
    const password = form['signin-password'].value;
    const auth = window._DEFAULT_DATA[0];

    auth.signInWithEmailAndPassword(email, password)
    .then(cred => {
      console.log(`${cred.user.email} logged in`);
      form.reset();
      form.closest('#modal-signin').classList.remove('shown');
    })
    .catch(err => {
      console.log('could not log in:');
      console.log(err.message);
    });

  }

  return (
    <div id="modal-signin" className="modal user-state" onClick={toggleSignin}>
      <div className="modal-content">
        <h2>Sign in</h2>
        <form id="signin-form" onSubmit={handleSubmit}>
          <div className="input-field">
            <input type="email" id="signin-email" placeholder="Email"/>
          </div>
          <div className="input-field">
            <input type="password" id="signin-password" placeholder="Password"/>
          </div>
          <div className="or-container">
            <div className="h-line">
              <hr/>
            </div>
            <div className="or">
              OR
            </div>
            <div className="h-line">
              <hr/>
            </div>
            <div className="h-space">
            </div>
          </div>
          <img src={require('../googleLogin/web/2x/btn_google_signin_dark_normal_web@2x.png')} alt="Google Login" onClick={googleLogin}/>
          <button className="btn btn-outline-warning my-2 my-sm-0">Sign in</button>
        </form>
      </div>
    </div>
  )
}

export default SignIn
