import TableItem from 'components/TableItem';
import React from 'react';
import {contains} from 'ramda';
import styled from 'styled-components';

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

export default TableItemGroup;