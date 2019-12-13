import React, { Component } from 'react';
import './App.css';
import styled from 'styled-components';
import SignUp from 'pages/SignUp';
import Sapa from 'pages/Sapa';
import 'whatwg-fetch';
import Header from 'components/Header';
import { Router, Link } from "@reach/router";



const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const WishList = styled.div`
  height: 100vh;
  width: 100vw;
`
class App extends Component {
  constructor() {
    super();
    this.state= {
      signUp: false
    }
  }

  toggleSignUp = () => this.setState(currState => ({signUp: !currState.signUp}));

  render() {
    const {signUp} = this.state;

    return (
      <div className="App">
        <AppContainer id='appcontainer'>
          <Header logout={this.logout} toggleSignUp={this.props.toggleSignUp} setUserLoggedIn={this.setLoggedIn}/>
          <Router>
            <SignUp path="register" toggleSignUp={this.toggleSignUp}/>
            <Sapa path="search" toggleSignUp={this.toggleSignUp}/>
            <WishList path="wishlist" />
          </Router>
        </AppContainer>
      </div>
    );
  }
}

export default App;
