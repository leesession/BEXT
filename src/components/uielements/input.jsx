import React from 'react';

import styled from 'styled-components';
import { device } from '../../config/device';

const InputWrapper = styled.input`
    padding: 12px 10px 13px 10px;
    border: 1px solid transparent;
    width: 100%;
    margin-top: 20px;
    font-size: 1rem;
    outline: 0;
    background: #000;
    color: #fff;

    @media ${device.laptop} {
      font-size: 1.1rem;
    }
`;

class Input extends React.Component {
  render() {
    const { ...props } = this.props;

    return (
      <InputWrapper {...props} />
    );
  }
}


Input.propTypes = {

};

Input.defaultProps = {

};

export default Input;
