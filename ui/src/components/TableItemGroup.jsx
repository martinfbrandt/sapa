import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';


const Container = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
`

const TableItemGroup = ({children, day}) => {
    return <Container>
        <h5>{day}</h5>
            {children}
    </Container>
}

TableItemGroup.defaultProps = {
    day: '',
}

TableItemGroup.propTypes = {
  day: PropTypes.string,

}

export default TableItemGroup;