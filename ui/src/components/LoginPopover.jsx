import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import {lightGreen, headerHeight} from 'variables';
import {Formik,} from 'formik';
import Button from 'components/Button';
import FormItem from 'components/FormItem'
import {logInUser} from 'Api';
import {dissoc} from 'ramda';
import InlineError from 'components/InlineError';
const PopoverContainer = styled.div`
    height: 300px;
    width: 400px;
    background-color: ${lightGreen};
    position: absolute;
    top: ${headerHeight};
    right: 0;
    border-left: 1px solid gray;
    border-right: 1px solid gray;
    border-bottom: 1px solid gray;
    padding:10px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const StyledForm = styled.form`
    margin: 5px;
    align-items:center;
    display:flex;
    flex-direction:column;
    flex: 1
`

document.getElementById('SapaHeader')
class LoginPopover extends Component {
    constructor() {
        super();
        this.el = document.createElement('div');
        this.state = {
            error: null
        }
    }

    componentDidMount(){
        const {rootId} = this.props
        document.getElementById(rootId).appendChild(this.el);
    }

    componentWillUnmount(){
        const {rootId} = this.props
        document.getElementById(rootId).removeChild(this.el);
    }
    
    render() {
        return ReactDOM.createPortal(
        <PopoverContainer id='popover-container'>
            <Formik
                onSubmit={ async (values, { setSubmitting }) => {
                    setTimeout(() => {
                        setSubmitting(false);
                    }, 400);
                    try{
                        const userObject = await logInUser(values);

                        //set the user returned from the promise
                        sessionStorage.setItem('user', JSON.stringify(userObject));

                        this.props.setUser(dissoc('jwt', userObject));

                        this.props.toggleLogin();
                    } catch (err){
                        this.setState({error: err.message})
                    }
                }}
            >{({values,
                errors,
                touched,
                handleChange,
                handleSubmit,
                isSubmitting}) =>
                <StyledForm onSubmit={handleSubmit}>
                    <FormItem
                        id="login-email-input"
                        name='email'
                        type='email'
                        handleChange={handleChange}
                        value={values.email}
                    />
                    <FormItem
                        id="login-pw-input"
                        name='password'
                        type='password'
                        handleChange={handleChange}
                        value={values.password}
                    />
                    <InlineError id='login-errors' err={this.state.error}/>
                    <Button inverse value='Login' id='submit-login' type='submit'/>
                </StyledForm>
            }
            </Formik>
        </PopoverContainer>, this.el)
    }
}

export default LoginPopover;