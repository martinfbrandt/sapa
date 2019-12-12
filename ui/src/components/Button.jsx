import React from 'react';
import styled from 'styled-components';
import {darkerGreen, lightGreen} from 'variables';

const StyledButton = styled.button`
    margin: 3px;
    height: 35px;
    width: 75px;
    background-color: ${({inverseColor}) => inverseColor ? 'white': lightGreen}
    color: ${({inverseColor}) => inverseColor ? darkerGreen: 'white'};
    font-weight: 600;
    border: none;
`

const Button = ({type, inverse, id, disabled, onClick, value}) => {
    return <StyledButton id={id} disabled={disabled} inverseColor={inverse} type={type} onClick={onClick} >{value}</StyledButton>
}

export default Button;