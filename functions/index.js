const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.newUserSignUp = functions.auth.user().onCreate(user => {
  return admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    authLevel: 'basic'
  });
});

exports.userDeleted = functions.auth.user().onDelete(user => {
  const doc = admin.firestore().collection('users').doc(user.uid);
  return doc.delete();
})


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
