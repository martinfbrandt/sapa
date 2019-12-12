import React from 'react'
import styled from 'styled-components';
import {inputGreen} from 'variables';

const StyledInput = styled.input`
    margin: 5px;
    height: 30px;
    border: none;
    width: 340px;
    padding: 5px;
    font-family: sans-serif;
    font-weight: 500;
    font-size: medium;
    background-color: ${inputGreen}
`;

const StyledLabel = styled.label`
    margin-left:10px;
`
const FormItemContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 10px 0 10px 0;
    align-items: start;
`

const FormItem = ({type, id, name, value, displayName, handleChange}) => 
                        <FormItemContainer>
                            <StyledLabel>{displayName ? displayName : name}</StyledLabel>
                            <StyledInput
                                id={id}
                                type={type}
                                name={name}
                                onChange={handleChange}
                                value={value}
                            />
                        </FormItemContainer>

export default FormItem;