import React from 'react';
import PropTypes from 'prop-types';
import { LayoutContentWrapper } from './layoutWrapper.style';

export default function LayoutWrapper(props) {
  return (
    <LayoutContentWrapper
      className={
        props.className != null
          ? `${props.className} isoLayoutContentWrapper`
          : 'isoLayoutContentWrapper'
      }
      {...props}
    >
      {props.children}
    </LayoutContentWrapper>
  );
}

LayoutWrapper.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
};

LayoutWrapper.defaultProps = {
  className: '',
};
