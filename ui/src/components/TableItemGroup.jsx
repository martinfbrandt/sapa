import TableItem from 'components/TableItem';
import React from 'react';
import {contains} from 'ramda';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import PlusIcon from 'components/PlusIcon';


const Container = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
`

const TableItemGroup = ({experiences, day, scheduleExperience, deleteExperience, updateExperience, saveExperience, idx, toggleEditing,  editingItems}) => {
    return <Container>
        <h5>{day}</h5>
        {
            experiences.map((experience, experienceidx) => <TableItem 
                                                                experience={experience}
                                                                toggleEditing={toggleEditing}
                                                                id={`item-${experience.id}`}
                                                                key={`item-${idx}-${experienceidx}`}
                                                                saveExperience={saveExperience}
                                                                updateExperience={updateExperience}
                                                                deleteExperience={deleteExperience}
                                                            >
                                    <Button id={`${experience.id}-delete-button`} value="Delete" onClick={() => deleteExperience(experience)} />
                                    <Button id={`${experience.id}-schedule-button`} value="Schedule" onClick={() => scheduleExperience(experience)} />
                                    {contains(`item-${experience.id}`, editingItems) ? (
                                    <>
                                        <Button id={`${experience.id}-save-button`} value="Save" onClick={() => {
                                                experience.id ? updateExperience(experience.id, experience) : saveExperience(experience);
                                                toggleEditing(experience.id);
                                            }} />
                                        <Button id={`${experience.id}-cancel-button`} value="Cancel" onClick={() => toggleEditing(experience.id)} />
                                    </>
                                    ) : (
                                    <Button id={`${experience.id}-edit-button`} value="Edit" onClick={() => toggleEditing(experience.id)} />
                                    )}
                                </TableItem>
                              )   
            }
            <PlusIcon height="100px" width="100px"/>
    </Container>
}

TableItemGroup.defaultProps = {
    saveExperience: () => {},
    updateExperience: () => {},
    deleteExperience: () => {},
    toggleEditing: () => {},
    experiences: [
        {
            name:'New Experience',
            description: 'This new experience will blow your mind'
        }
    ],
    day: '',
    idx: 1,
}

TableItemGroup.propTypes = {
 experiences: PropTypes.arrayOf(PropTypes.object).isRequired,
 toggleEditing: PropTypes.func.isRequired,
 saveExperience: PropTypes.func.isRequired,
 day: PropTypes.string,
 updateExperience: PropTypes.func.isRequired,
 deleteExperience: PropTypes.func.isRequired,
 editingItems: PropTypes.arrayOf(PropTypes.string).isRequired,
 idx: PropTypes.number.isRequired,
}

export default TableItemGroup;