import React, {Component} from 'react';
import styled from 'styled-components';
import {headerHeight, lightGreen} from 'variables';
import TableItemGroup from 'components/TableItemGroup';
import Table from 'components/Table';

const StyledContainer = styled.div`
  background-color: ${lightGreen};
  height: calc(100vh - ${headerHeight} - 70px) ;
  margin: 30px 30px 0 30px;
  padding: 20px;
  overflow: auto;
`;


class Wishlist extends Component {
  constructor() {
      super();
  }

  render() {
      const {experiences, editingItems} = this.props;

      return (
        <StyledContainer>
            <h3>Wish List</h3>
            <Table >
                {
                    <TableItemGroup 
                        experiences={experiences}
                        editingItems={editingItems}
                    />
                }
            </Table>        
            </StyledContainer>
      )
      
  }
  
}

Wishlist.defaultProps = {
    editingItems: [],
    idx: 1,
    toggleEditing: () => {},

    
}

export default Wishlist;