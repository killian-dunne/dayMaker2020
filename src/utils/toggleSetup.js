export const toggleSignup = (e) => {
  if (e.target.classList.contains('userState')) {
    const signUpModal = document.querySelector('#modal-signup');
    signUpModal.classList.toggle('shown');
  }

}

export const toggleSignin = (e) => {
  if (e.target.classList.contains('userState')) {
    const signInModal = document.querySelector('#modal-signin');
    signInModal.classList.toggle('shown');
  }
}
