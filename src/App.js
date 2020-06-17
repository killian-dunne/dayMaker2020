import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import { addUserToCollection } from './utils/dbStuff';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      searchedPlan: ''
    }
  }

  componentDidMount() {
    const auth = window._DEFAULT_DATA[0];
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log('user is logged in: ', user)
        // Add collection user if needed
        addUserToCollection(user).then(() => {
          this.setState({
            user: user
          })
        });
      } else {
        this.setState({
          user: null
        })
        console.log('user is logged out')
      }
    })
  }

  scrollToPlan = searchedPlan => {
    this.setState({searchedPlan});
    setTimeout(() => {
      this.setState({searchedPlan: ''})
    }, 4000)
  }

  render() {
    return (
      <div className="App">
        <Navbar user={this.state.user} searchedPlan={this.state.searchedPlan} scrollToPlan={this.scrollToPlan}/>
        <Dashboard user={this.state.user} searchedPlan={this.state.searchedPlan}/>
        <div className="display-signup">
          <SignUp callLogin={this.toggleLoggedIn}/>
        </div>
        <div className="display-signin">
          <SignIn callLogin={this.toggleLoggedIn}/>
        </div>
      </div>
    );
  }
}

export default App;
