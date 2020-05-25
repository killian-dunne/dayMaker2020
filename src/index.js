import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

require('dotenv').config();
const apiKey = process.env.REACT_APP_API_KEY

const firebase = require('firebase');
var firebaseConfig = {
  apiKey: apiKey,
  authDomain: "daymaker-13c82.firebaseapp.com",
  databaseURL: "https://daymaker-13c82.firebaseio.com",
  projectId: "daymaker-13c82",
  storageBucket: "daymaker-13c82.appspot.com",
  messagingSenderId: "859874985780",
  appId: "1:859874985780:web:f705fd75fdc8ea3f300761",
  measurementId: "G-JK0CT5P76X"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
db.settings({ experimentalForceLongPolling: true });

// Initialize Firebase
window._DEFAULT_DATA = [auth, db];

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
