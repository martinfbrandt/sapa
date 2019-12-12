import React, { Component } from 'react';
import './App.css';
import styled from 'styled-components';
import ListApp from 'pages/ListApp';
import SignUp from 'pages/SignUp';
import Sapa from 'pages/Sapa';
import 'whatwg-fetch';



const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;
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
         {signUp ?  <SignUp toggleSignUp={this.toggleSignUp}/> : <Sapa toggleSignUp={this.toggleSignUp}/> }
        </AppContainer>
      </div>
    );
  }
}

export default App;
