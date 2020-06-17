import { addUserToCollection } from './dbStuff';
const firebase = require('firebase');

export const toggleSignup = (e) => {
  if (e.target.classList.contains('user-state')) {
    const signUpModal = document.querySelector('#modal-signup');
    signUpModal.classList.toggle('shown');
    signUpModal.querySelector('#signup-firstName').focus();
  }
}

export const toggleSignin = (e) => {
  if (e.target.classList.contains('user-state')) {
    const signInModal = document.querySelector('#modal-signin');
    signInModal.classList.toggle('shown');
    signInModal.querySelector('#signin-email').focus();
  }

}

export const googleLogin = async e => {
  e.persist();
  var provider = new firebase.auth.GoogleAuthProvider();
  let db = window._DEFAULT_DATA[1];
  try {
    let result = await firebase.auth().signInWithPopup(provider);

  //  var token = result.credential.accessToken; // This gives you a Google Access Token. You can use it to access the Google API.
  //  var user = result.user; // The signed-in user info.
    
    console.log('User is going to be logged in!')
    let form = e.target.closest('form');
    form.reset();
    if (form.closest('#modal-signin')) {
      form.closest('#modal-signin').classList.remove('shown');
    } else {
      form.closest('#modal-signup').classList.remove('shown');
    }
  } catch (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;    // The firebase.auth.AuthCredential type that was used.
    console.log('We have an error')
    console.log(errorMessage)
  }

}
