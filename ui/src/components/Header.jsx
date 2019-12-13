import React, {Component} from 'react';
import styled from 'styled-components';
import {lightGreen} from 'variables';
import LoginPopover from 'components/LoginPopover';
import Button from 'components/Button';
import {headerHeight} from 'variables';
import {Link} from '@reach/router';

const HeaderContainer = styled.div`
  width: 100%;
  background-color: ${lightGreen};
  height: ${headerHeight};
  justify-content: space-between;
  align-items: center;
  display: flex;
  border-bottom: 1px solid grey;
`;

const ButtonContainer = styled.div`
  justify-content: flex-end;  
  display:flex;
  padding:3px;
`

const StyledHeader = styled.h3`
  margin-left:30px;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: blue;
`


class Header extends Component {
  constructor() {
    super();
    this.state = {
      isLoggingIn: false
    }
  }

  toggleLogin = () => this.setState(currState => ({isLoggingIn: !currState.isLoggingIn}));

  render(){
    const isLoggedIn = sessionStorage.getItem('user') !== null

    const {setUserLoggedIn, logout} = this.props;
      return (
              <HeaderContainer>
                <StyledLink to="search">
                  <StyledHeader>Sapa</StyledHeader>
                </StyledLink>
                <ButtonContainer id='SapaHeader'>
                  {this.state.isLoggingIn && <LoginPopover toggleLogin={this.toggleLogin} setUser={setUserLoggedIn} rootId='SapaHeader'/>}
                  <Button id="signup-button" to="register" inverse value='Sign Up'/>
                  {isLoggedIn ? <Button id="logout-button" inverse onClick={logout} value='Logout'/> : <Button id="login-button" inverse onClick={this.toggleLogin} value='Login'/>}
                </ButtonContainer>
              </HeaderContainer>
      )
  }
}

export default Header;