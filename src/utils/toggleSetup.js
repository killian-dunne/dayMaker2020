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
