import React from "react";
import styled from "styled-components";
import { set, equals, lensPath} from "ramda";
import {lightGreen} from 'variables';
import moment from 'moment';
import InlineError from 'components/InlineError';

const Item = styled.div`
  height: 250px;
  width: 50%;
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

const Left = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-right: 20px;
  border-right: 1px black;

`

const Buttons = styled.div`
 display: flex;
 flex-direction: column;
`

const Description = styled.div`
  width: 150px;
  padding: 15px;
  font-weight: 100;
  font-family: sans-serif;
  overflow: hidden;
`

const Picture = styled.img`
  height: 150px;
  width: 150px;
`;

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
      children,
      isEditing = false,
    } = this.props;
    const { experience } = this.state;

    return (
      <Item key={id} id={id}>
        <Left>
          <PropertyItem>
            {isEditing ? (
              <StyledInput
                id={`${id}-name-input`}
                defaultValue={experience.name}
                onChange={({target}) => this.updateState(parseInt(target.value), "name")}
              />
            ) : (
              <h4>{experience.name}</h4>
            )}
          </PropertyItem>          
          <Picture src="https://bkkaruncloud.b-cdn.net/wp-content/uploads/2019/01/de-hanoi-a-sapa.jpg"/>
        </Left>
        <PropertyContainer>
          <PropertyItem>
            {isEditing ? (
              <StyledInput
                id={`${id}-description-input`}
                defaultValue={experience.description}
                onChange={({target}) => this.updateState(target.value, "description")}
              />
            ) : (
              <Description>{experience.description}</Description>
            )}
          </PropertyItem>
          <PropertyItem>
            <label id={`${id}-date-created`}>{`Date Created: ${moment(experience.created_dt, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')}`}</label>
          </PropertyItem>
          <PropertyItem>
            <label id={`${id}-time-created`}>{`Time Created: ${moment(experience.created_dt, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss')}`}</label>
          </PropertyItem>
        </PropertyContainer>  
        <Buttons>
        {children}
        </Buttons>
        <ErrorContainer>          
          <InlineError err={this.state.experience.error}/>
        </ErrorContainer>
      </Item>
    );
  }
}


export default TableItem;
