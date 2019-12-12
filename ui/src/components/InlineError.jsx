import React from 'react';
import styled from 'styled-components';

const StyledError = styled.label`
    color: red;
    font-size: 10px;
`


const InlineError = ({err, id}) => <StyledError id={id}>{err}</StyledError>;


export default InlineError;