import React from "react";
import { Formik } from "formik";
import Button from "components/Button";
import styled from "styled-components";
import moment from "moment";
import InlineError from 'components/InlineError';
import {inputGreen} from 'variables'

const FilterContainer = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border: 1px solid white;
`;

const StyledInput = styled.input`
  border: none;
  display: flex;
  width: 100px;
  height: 30px;
  margin: 3px;
  text-align: center;
  background-color: ${inputGreen}
`;

const StyledFilterItem = styled.div`
  display: block;
  flex-direction: column;
`;

const isValidDate = date => moment(date, "YYYY-MM-DD", true).isValid()
const isValidTime = time => moment(time, "HH:mm:ss", true).isValid()



const Filter = ({ setFilter, filter, clearFilter }) => {
  return (
    <Formik
      initialValues={filter}
      enableReinitialize
      validate={values => {
        let errors = {};
        if (!isValidDate(values.startDate)) {
          errors.startDate = "Must be valid date";
        }
        if (!isValidDate(values.endDate)) {
            errors.endDate = "Must be valid date";
          }
          if (!isValidTime(values.startTime)) {
            errors.startTime = "Must be valid time";
          }
          if (!isValidTime(values.endTime)) {
            errors.endTime = "Must be valid time";
          }
        return errors;
      }}
      onSubmit={values => setFilter(values)}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        handleReset,
        isSubmitting
      }) => (
        <FilterContainer id='filter-component' onSubmit={handleSubmit}>
          <label>Start Date</label>
          <StyledFilterItem>
            <StyledInput
              id='filter-startdate' 
              type="text"
              name="startDate"
              onChange={handleChange}
              value={values.startDate}
            /><InlineError id='startdate-err' err={errors.startDate}/>
          </StyledFilterItem>
          <label>End Date</label>
          <StyledFilterItem>
            <StyledInput
              id='filter-enddate' 
              type="text"
              name="endDate"
              onChange={handleChange}
              value={values.endDate}
            /><InlineError id='enddate-err' err={errors.endDate}/>
          </StyledFilterItem>
          <label>Start Time</label>
          <StyledFilterItem>
            <StyledInput
              id='filter-starttime' 
              type="text"
              name="startTime"
              onChange={handleChange}
              value={values.startTime}
            /><InlineError id='starttime-err' err={errors.startTime}/>
          </StyledFilterItem>
          <label>End Time</label>
          <StyledFilterItem>
            <StyledInput
              id='filter-endtime' 
              type="text"
              name="endTime"
              onChange={handleChange}
              value={values.endTime}
            /><InlineError id='endtime-err' err={errors.endTime}/>
          </StyledFilterItem>
          <Button id='filter-submit' inverse value="Filter" type="submit" />
          <Button
            id='filter-clear' 
            inverse
            value="Clear Filter"
            type="button"
            onClick={() => {
              clearFilter(handleReset);
              
            }}
          />
        </FilterContainer>
      )}
    </Formik>
  );
};

export default Filter;
