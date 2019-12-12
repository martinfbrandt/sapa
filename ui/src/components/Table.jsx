import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  display:flex;
  flex-direction: column;
`

const Table = ({children}) => {
        return (
            <TableContainer>
                {children}
            </TableContainer>)
}

Table.defaultProps = {
    experiences:[{}]
}


export default Table;