import React, {Component} from 'react';
import styled from 'styled-components';
import {lightGreen} from 'variables';
import {Formik} from 'formik';
import {signUpUser} from 'Api';
import FormItem from 'components/FormItem';
import Button from 'components/Button';
import InlineError from 'components/InlineError';

const SignUpContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${lightGreen};
    align-items: center;
    margin: 40px 80px 40px 80px;
    padding: 20px 0 20px 0;
`;

const SignUpForm = styled.form`
    margin: 5px;
    display: flex;
    flex-direction: column;
    width: 300px;
    align-items: center;
`


class SignUp extends Component {
    constructor() {
        super();
        this.state = {
            createdUser: null,
            errors: null
        }
    }

    userCreatedForm = () => <div id='user-created-success'>
            <h4>{`User ${this.state.createdUser.email} created successfully`}</h4>
            <Button onClick={this.props.toggleSignUp} value='Start logging' />
        </div>

    setCreatedUser = user => this.setState({createdUser: user})

    render(){
        return this.state.createdUser ? this.userCreatedForm()
                : <Formik
                    initialValues={{ email: '', password: '', name: ''}}
                    validate={values => {
                        let errors = {};
                        if (!values.email) {
                          errors.email = 'Required';
                        } else if (
                          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                        ) {
                          errors.email = 'Invalid email address';
                        }
                        return errors;
                      }}
                    onSubmit={ async (values, { setSubmitting }) => {
                        setTimeout(() => {
                            setSubmitting(false);
                        }, 400);
                        try {
                            const user = await signUpUser(values);
                            this.setCreatedUser(user);
                            //set the user returned from the promise
                        } catch (err) {
                            this.setState({error: err.message});
                        }
                      
                    }}>
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                    }) => (<SignUpContainer id='signup-component'>
                            <h2>Create an account:</h2>
                                <SignUpForm onSubmit={handleSubmit}>
                                    <FormItem
                                            id='signup-email-input'
                                            type="email"
                                            name="email"
                                            handleChange={handleChange}
                                            value={values.email}
                                        />
                                    <FormItem
                                            id='signup-name-input'
                                            type="text"
                                            name="name"
                                            handleChange={handleChange}
                                            value={values.name}
                                        />
                                    <FormItem
                                            id='signup-pw-input'
                                            type="password"
                                            name="password"
                                            handleChange={handleChange}
                                            value={values.password}
                                        />
                                    <InlineError id='signup-error' err={this.state.error} />
                                    <Button id='signup-submit-button' inverse value='Submit' type="submit" disabled={isSubmitting}/>
                                    <Button id='signup-cancel-button' inverse value='Cancel' onClick={this.props.toggleSignUp} />
                                </SignUpForm>
                    </SignUpContainer> )}
                </Formik>
    }
}

export default SignUp;