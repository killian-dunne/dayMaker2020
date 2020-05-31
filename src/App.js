import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import NewDay from './components/NewDay';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import { getPlans } from './utils/dbStuff';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      plans: []
    }
  }

  componentDidMount() {
    const auth = window._DEFAULT_DATA[0];
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log('user is logged in: ', user)
        this.updatePlans().then(() => {
          this.setState({
            user: user
          })
        })
      } else {
        this.setState({
          user: null
        })
        console.log('user is logged out')
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.user !== this.state.user) {
      if (this.state.user) {
        this.updatePlans();
      } else {
        this.setState({plans: []});
      }
    }
  }

  updatePlans = async () => {
    let orderedPlans = await getPlans();
    this.setState({
      plans: orderedPlans
    });
    return;
  }

  render() {
    return (
      <div className="App">
        <Navbar user={this.state.user}/>
        <div className="gen-area">
          <Dashboard user={this.state.user} plans={this.state.plans}/>
          <div id="create-new" className="plan-box bg-light">
            <NewDay user={this.state.user}/>
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
