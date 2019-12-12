import React from "react";
import styled from "styled-components";
import Button from "components/Button";
import { set, equals, lensPath} from "ramda";
import {lightGreen} from 'variables';
import moment from 'moment';
import InlineError from 'components/InlineError';

const Item = styled.div`
  height: 80px;
  width: 90%;
  background-color: white;
  margin-top: 5px;
  margin-left: 5px;
  display:flex;
  align-items:center;
  cursor: default;
  border-radius: 15px;
  opacity:.9
`;

const ErrorContainer = styled.div`
  margin-left:10px;
`

const PropertyContainer = styled.div`
  width: 50%;
  display:flex;
  flex-direction:column;
  margin: 5px;
`
const PropertyItem = styled.div`
  padding-left: 10px;
  display:flex;
  align-items: flex-start;
`

const StyledInput = styled.input`
  border-top:none;
  border-left:none;
  border-right:none;
  border-bottom: 2px solid ${lightGreen};
  font-weight: 500;
  margin-left: 3px;
`

const StatusIndicator = styled.div`
  border-radius:50%;
  width: 12px;
  height: 12px;
  border: 1px solid black
  margin-left:5px;
  opacity: .85
`

// Component displays the basic table item where the user adds descriptions and name
class TableItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      experience: props.experience || {}
    };
  }

  updateState = (value, key) => {
    this.setState(prevState => set(lensPath(['experience', key]), value, prevState));
  };

  componentDidUpdate(prevProps){
    if(!equals(prevProps.experience, this.props.experience)){
      this.setState({experience: this.props.experience})
    }
  }

  render() {
    const {
      id,
      toggleEditing,
      saveExperience,
      updateExperience,
      isEditing = false,
    } = this.props;
    const { experience } = this.state;

    return (
      <Item key={id} id={id}>
        <StatusIndicator id={`${id}-status-indicator`}/>
        <PropertyContainer>
          <PropertyItem>
            <label>Description:</label>
            {isEditing ? (
              <StyledInput
                id={`${id}-description-input`}
                defaultValue={experience.description}
                onChange={({target}) => this.updateState(target.value, "description")}
              />
            ) : (
              <label>{experience.description}</label>
            )}
          </PropertyItem>
          <PropertyItem>
            <label>Name:</label>
            {isEditing ? (
              <StyledInput
                id={`${id}-name-input`}
                defaultValue={experience.name}
                onChange={({target}) => this.updateState(parseInt(target.value), "name")}
              />
            ) : (
              <label>{experience.name}</label>
            )}
          </PropertyItem>
          <PropertyItem>
            <label id={`${id}-date-created`}>{`Date Created: ${moment(experience.created_dt, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')}`}</label>
          </PropertyItem>
          <PropertyItem>
            <label id={`${id}-time-created`}>{`Time Created: ${moment(experience.created_dt, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss')}`}</label>
          </PropertyItem>
        </PropertyContainer>  
        <Button id={`${id}-delete-button`} value="Delete" onClick={() => this.props.deleteExperience(experience)} />
        {isEditing ? (
          <>
            <Button id={`${id}-save-button`} value="Save" onClick={() => {
                    experience.id ? updateExperience(experience.id, experience) : saveExperience(experience);
                    toggleEditing(id);
                }} />
            <Button id={`${id}-cancel-button`} value="Cancel" onClick={() => toggleEditing(id)} />
          </>
        ) : (
          <Button id={`${id}-edit-button`} value="Edit" onClick={() => toggleEditing(id)} />
        )}
        <ErrorContainer>          
          <InlineError err={this.state.experience.error}/>
        </ErrorContainer>
      </Item>
    );
  }
}

export default TableItem;
