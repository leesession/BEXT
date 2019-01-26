import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _ from 'lodash';

const ButtonWrapper = styled.a`
    display: block;
    background-color: #ffbc00;
    color: black;
    font-weight: 500;
    border-radius: 0px;
    width: ${(props) => _.isNumber(props.width) ? `${props.width}px` : props.width};
    height: ${(props) => _.isNumber(props.height) ? `${props.height}px` : props.height};
    line-height:${(props) => _.isNumber(props.height) ? `${props.height}px` : props.height};
    float: ${(props) => props.float};
    text-align: center;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    
    &:hover{
        color: black;
    }
    &[disabled]{
      background-color: rgba(255,188,0,0.25);
    }
`;

class Button extends React.PureComponent {
  render() {
    const {
      children, ...rest
    } = this.props;
    return (<ButtonWrapper className="betx-btn" href={null} {...rest}>
      {children}
    </ButtonWrapper>);
  }
}

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  onClick: PropTypes.func,
  float: PropTypes.string,
};

Button.defaultProps = {
  onClick: undefined,
  float: undefined,
};

export default Button;
