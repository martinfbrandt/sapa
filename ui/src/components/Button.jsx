import React from 'react';
import styled from 'styled-components';
import {darkerGreen, lightGreen} from 'variables';
import {Link} from '@reach/router';

const StyledButton = styled.button`
    margin: 3px;
    padding: 0;
    height: 35px;
    width: 75px;
    background-color: ${({inversecolor}) => inversecolor ? 'white': lightGreen}
    color: ${({inversecolor}) => inversecolor ? darkerGreen: 'white'};
    font-weight: 600;
    border: none;
`

const StyledLink = styled(Link)`
    margin: 3px;
    height: 35px;
    width: 75px;
    background-color: ${({inversecolor}) => inversecolor ? 'white': lightGreen}
    border: none;
    text-decoration: none;
    line-height: 35px;
    `
const StyledLabel = styled.label`
    color: ${({inversecolor}) => inversecolor ? darkerGreen: 'white'};
    font-weight: 600;
    font-size: 11px;
    font-family:system-ui;
    text-decoration-line: none;
`

const Button = ({type, to,  inverse, id, disabled, onClick, value}) => {
    return to ? 
    <StyledLink 
      to={to} 
      inversecolor={inverse}> 
      <StyledLabel 
        inversecolor={inverse} 
      >{value}</StyledLabel>
    </StyledLink>
    : <StyledButton 
        id={id} 
        disabled={disabled} 
        inversecolor={inverse} 
        type={type} 
        onClick={onClick} >{value}
      </StyledButton>
}

export default Button;