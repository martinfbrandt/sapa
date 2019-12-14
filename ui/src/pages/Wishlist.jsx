import React, {Component} from 'react';
import styled from 'styled-components';
import {headerHeight, lightGreen} from 'variables';
import TableItemGroup from 'components/TableItemGroup';
import Table from 'components/Table';
import {append, equals, uniqBy, prop, propEq, filter} from 'ramda';
import TableItem from 'components/TableItem';
import Button from 'components/Button';
import PlusIcon from 'components/PlusIcon';


const StyledContainer = styled.div`
  background-color: ${lightGreen};
  height: calc(100vh - ${headerHeight} - 70px) ;
  margin: 30px 30px 0 30px;
  padding: 20px;
  overflow: auto;
`;

// wraps list to enforce ID PK
const uniqById = uniqBy(prop('id'))


class Wishlist extends Component {
  constructor(props) {
      super(props);
      this.state = {
          experiences: [],
          editingItemId: -1,
      }
  }

  addExperience = () => {
      const experienceStub = {id:0}; 
      this.setState({experiences: append(experienceStub, this.state.experiences)});
  }

  removeExperience = experience => {
    this.setState({experiences: filter(propEq('id')(experience), this.state.experiences)});

    // add API call
  }

  scheduleExperience = experience => {
      // add API call
  }

  saveExperience = () => {
      // add API call
  }

  editItem = itemId => this.setState({editingItemId: itemId});

  cancelEdit = () => this.setState({editingItemId: -1});

  render() {
      const {experiences, editingItemId} = this.state;
      return (
        <StyledContainer>
            <h3>Wish List</h3>
            <Table >
                {
                    <TableItemGroup> 
                    {
                        uniqById(experiences).map((experience, experienceidx) => 
                            <TableItem 
                                experience={experience}
                                id={`item-${experience.id}`}
                                key={`item-${experienceidx}`}
                                isEditing={equals(experience.id, editingItemId)}
                            >
                                    <Button id={`${experience.id}-delete-button`} value="Delete" onClick={() => this.removeExperience(experience)} />
                                    <Button id={`${experience.id}-schedule-button`} value="Schedule" onClick={() => this.scheduleExperience(experience)} />
                                    {
                                        equals(experience.id, editingItemId) ? (
                                            <>
                                                <Button id={`${experience.id}-save-button`} value="Save" onClick={() => this.saveExperience(experience)} />
                                                <Button id={`${experience.id}-cancel-button`} value="Cancel" onClick={() => this.cancelEdit(experience.id)} />
                                            </>
                                            ) : (
                                            <Button id={`${experience.id}-edit-button`} value="Edit" onClick={() => this.editItem(experience.id)} />
                                            )}
                            </TableItem>
                        )   
            }            
                        <PlusIcon height="100px" width="100px" onClick={this.addExperience} />
                    </TableItemGroup>
                }
            </Table>        
            </StyledContainer>
      )
      
  }
  
}

Wishlist.defaultProps = {
    idx: 1,
    toggleEditing: () => {},

    
}

export default Wishlist;