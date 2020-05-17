import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import NewDay from './components/NewDay';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined
    }
  }

  componentDidMount() {
    const auth = window._DEFAULT_DATA[0];
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log('user is logged in: ', user)
        this.setState({
          user: user
        })
      } else {
        this.setState({
          user: null
        })
        console.log('user is logged out')
      }
    })
  }

  render() {
    return (
      <div className="App">
        <Navbar user={this.state.user}/>
        <div className="gen-area">
          <div className="dashboard">
            <Dashboard />
          </div>
          <div className="create-new">
            <NewDay />
          </div>
        </div>
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
