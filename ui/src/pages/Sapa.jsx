import React, {Component,} from 'react';
import Table from 'components/Table';
import styled from 'styled-components';
import {loadUserExperiences, deleteExperience, loadUser, saveNewExperience, updateExperience, updateUser} from 'Api';
import {append, prepend, without, sort, equals, isEmpty, contains, assoc, filter, complement, concat, set, lensPath, keys, propEq, groupBy, prop} from 'ramda';
import Button from 'components/Button';
import TableItemGroup from 'components/TableItemGroup';
import moment from 'moment';
import Filter from 'components/Filter';
import {headerHeight, lightGreen} from 'variables';

const Body = styled.div`
  background-color: ${lightGreen};
  height: calc(100vh - ${headerHeight} - 70px) ;
  margin: 30px 30px 0 30px;
  padding: 20px;
  overflow: auto;
`;

const ControlPanel = styled.div`
  background-color: ${lightGreen};
  height: 60px;
  display:flex;
  flex-direction:row;
  margin: 30px;
  align-items: center;
  justify-content: center
`;

const initialFilterState = {
    startTime: '00:00:00',
    endTime: '23:59:59',
    startDate: '1900-01-01',
    endDate: '2090-01-01'
}

const isNotEmpty = complement(isEmpty)

const dateConstant = 'YYYY-MM-DD HH:mm:ss'

const convertStringToMoment = date => moment(date, dateConstant).utc()

const getexperienceMoment = experience => convertStringToMoment(prop('created_dt', experience))

const getDay = date => moment(date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')

const isExpiredUserErr = err => err.message === 'Expired Token'

const initialState = {
    experiences:[],
    filter: initialFilterState,
    user: {},
};

class Sapa extends Component {
    constructor() {
        super();
        this.state = initialState;
    }

    componentDidMount(){
        const cachedUser = JSON.parse(sessionStorage.getItem('user'));
        if(cachedUser){
            this.setState({user: cachedUser})
            this.loadInitialState(cachedUser);
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(isNotEmpty(this.state.user) && !equals(prevState.user, this.state.user)){
            //load the experiences
            this.getexperiences();
            
        }
    }

    // sets the state of the item filter
    setFilter = filters => {
        this.setState(prevState => set(lensPath(['filter']), filters, prevState))
    }

    // resets the state of the item filter
    clearFilter = cb => {
        this.setFilter(initialFilterState)
        cb();
    }

    // executes on click of the "filter" button, filters the experiences in state that are sent down the tree
    filterexperiences = experiences => {
        const {filter} = this.state;
        const startDateTimeString = concat(concat(filter.startDate,' '), filter.startTime);
        const endDateTimeString = concat(concat(filter.endDate,' '), filter.endTime);

        // extracts the start and end date/time of the filter and creates a moment for each
        const startDateTime = convertStringToMoment(startDateTimeString);
        const endDateTime = convertStringToMoment(endDateTimeString);
        
        // checks to see if the experience should show based on the filter
        const isInRange = dateTimeMoment => startDateTime.isBefore(dateTimeMoment) && endDateTime.isAfter(dateTimeMoment)
        
        // sort function uses moment's natural sortability
        const momentComparator = (experienceA, experienceB) => getexperienceMoment(experienceB) - getexperienceMoment(experienceA);

        // sort by most recent first
        const sortexperiences = experiences => sort(momentComparator, experiences)

        return sortexperiences(experiences).filter(experience => isInRange(getexperienceMoment(experience)));

    }  

    clearUserOnExpiration = err => {
        if(isExpiredUserErr(err)){
            this.setState(initialState)
        }
    }

    // toggles the list item editing state based on its ID
    toggleEditing = id => {
        contains(id, this.state.editingItems) ? 
        this.setState(prevState => ({editingItems: without(id, prevState.editingItems)})) :
        this.setState(prevState => ({editingItems: prepend(id, prevState.editingItems)}))
    }

    // sets up the initial state, called when component mounts
    // loads newest version of cached user
    loadInitialState = async cachedUser => {
        try {
            const loadedUser = await loadUser(cachedUser.id);
            const experiences = await loadUserExperiences();

            this.setState({user: loadedUser, experiences: experiences});
        } catch (err){
            this.clearUserOnExpiration(err)
        }
    }

    // retrieves the user's experiences and sets the state
    getexperiences = async () => {
        try {
            const experiences = await loadUserExperiences();
            this.setState({experiences: experiences});
        } catch (err){
            this.clearUserOnExpiration(err);
        }
    }

    // clears the user from the session and resets state to an empty user
    logout = () => {
        sessionStorage.clear();
        this.setState(initialState)
    }

    // saves a new user experience, and adds the new experience to the state
    saveExperience = async experience => {
        try {
            const newexperience = await saveNewExperience(experience);
            this.addNewexperienceToState(newexperience)
        } catch(err){
            this.clearUserOnExpiration(err);
            this.addNewexperienceToState(assoc('error', err.message, experience))
        }
        
    }

    // updates a user experience and replaces experience with updated experience in state
    updateExperience = async (experienceId, experience) => {
        try {
            const updatedexperience = await updateExperience(experienceId, experience);
            this.replaceExistingexperienceInState(updatedexperience)
        } catch(err){
            this.clearUserOnExpiration(err);
            this.replaceExistingexperienceInState(assoc('error', err.message, experience))
        }
    }
    // util function to add a new experience, and remove new experience stub from state
    addNewexperienceToState = newexperience => this.setState(prevState => ({
        experiences: append(newexperience, prevState.experiences.filter(complement(propEq)('id', 0)))
    }))

    // util function to filter out existing experience and add the updated version to state
    replaceExistingexperienceInState = existingexperience => this.setState(prevState => ({
        experiences: append(existingexperience, prevState.experiences.filter(complement(propEq)('id', existingexperience.id)))
    }))

    // deletes the experience and removes it from the state
    removeExperience = async experience => {
        if(experience.id) {
          try {
              await deleteExperience(experience.id)
          } catch(err){
            this.clearUserOnExpiration(err);
          }
        }
        //remove experience from state
        this.setState(prevState => ({experiences: filter(complement(propEq)('id', experience.id), prevState.experiences)}));
    }

    // sets the user in state on login
    setLoggedIn = user => this.setState({user:user});

    // adds a new experience stub to the state, only allows one experience to be added at a time
    addNewexperience= () => {
        this.setState(prevState => ({experiences: append({"id":0, "created_dt": moment().utc().format(dateConstant)}, prevState.experiences.filter(complement(propEq)('id', 0)))}));
        this.toggleEditing("item-0");
    }


    render(){
        const {experiences, editingItems, filter, user} = this.state;

        // determines the groups of experiences per day
        const dayGroups = groupBy(experience => getDay(prop('created_dt', experience)))(this.filterexperiences(experiences));
        
        return <div>
                    <Body>
                        <h3>User experiences:</h3>
                        <ControlPanel>
                            <Button id='add-experience-button' inverse disabled={isEmpty(this.state.user)} value='add experience' onClick={this.addNewexperience}/>
                        </ControlPanel>

                        <Filter clearFilter={this.clearFilter} filter={filter} setFilter={this.setFilter}/>
                        <Table >{keys(dayGroups).map((date, idx) => 
                            <TableItemGroup 
                                key={`group-${idx}`}
                                day={date}
                                experiences={dayGroups[date]}
                                toggleEditing={this.toggleEditing}
                                editingItems={editingItems} 
                                idx={idx}
                                saveexperience={this.saveExperience}
                                updateexperience={this.updateExperience}
                                deleteexperience={this.removeExperience}
                            />
                        )}</Table>
        
                    </Body>
               
               </div>
    }
}


export default Sapa;
