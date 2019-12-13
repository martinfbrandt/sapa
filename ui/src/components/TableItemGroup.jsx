import TableItem from 'components/TableItem';
import React from 'react';
import {contains} from 'ramda';
import styled from 'styled-components';
import PropTypes from 'prop-types';


const Container = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
`

const TableItemGroup = ({experiences, day, deleteExperience, updateExperience, saveExperience, idx, toggleEditing,  editingItems}) => {

    return <Container>
        <h5>{day}</h5>
        {
            experiences.map((experience, experienceidx) => <TableItem 
                                    experience={experience}
                                    toggleEditing={toggleEditing}
                                    isEditing={contains(`item-${experience.id}`, editingItems)} 
                                    id={`item-${experience.id}`}
                                    key={`item-${idx}-${experienceidx}`}
                                    saveExperience={saveExperience}
                                    updateExperience={updateExperience}
                                    deleteExperience={deleteExperience}
                                />
                              )
            }
    </Container>
}

TableItemGroup.propTypes = {
 experiences: PropTypes.arrayOf(PropTypes.object).isRequired,
 toggleEditing: PropTypes.func,
 saveExperience: PropTypes.func,
 day: PropTypes.string,
 updateExperience: PropTypes.func,
 deleteExperience: PropTypes.func,
 editingItems: PropTypes.arrayOf(PropTypes.string).isRequired,
 idx: PropTypes.number.isRequired,
}

export default TableItemGroup;