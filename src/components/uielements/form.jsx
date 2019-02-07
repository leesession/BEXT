import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Input from './input';

const FormWrapper = styled.form`

`;

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    //   formErrors: { account: ''},
    //   formValid: false,
    };
  }


  //   validateField(fieldName, value) {
  //     const fieldValidationErrors = this.state.formErrors;
  //     let {account} = this.state;

  //     switch (fieldName) {
  //       case 'email':
  //         emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
  //         fieldValidationErrors.email = emailValid ? '' : ' is invalid';
  //         break;
  //       case 'password':
  //         passwordValid = value.length >= 6;
  //         fieldValidationErrors.password = passwordValid ? '' : ' is too short';
  //         break;
  //       default:
  //         break;
  //     }

  //     this.setState({
  //       formErrors: fieldValidationErrors,
  //     }, this.validateForm);
  //   }

  //   validateForm() {
  //     this.setState({ formValid: this.state.emailValid && this.state.passwordValid });
  //   }

  //   errorClass(error) {
  //     return (error.length === 0 ? '' : 'has-error');
  //   }

  render() {
    return (
      <FormWrapper className="form">
        {/* <div className="form-panel">
          <FormErrors formErrors={this.state.formErrors} />
        </div> */}
      </FormWrapper>
    );
  }
}

export default Form;
