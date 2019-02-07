import React from 'react';
import ReactDOM from 'react-dom';

import styled from 'styled-components';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { device } from '../../config/device';

const ModalWrapper = styled.section`
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    background: rgba(15,17,19,.9);
    visibility: hidden;
    opacity: 0;
    -webkit-transition: all .3s cubic-bezier(.165,.84,.44,1);
    transition: all .3s cubic-bezier(.165,.84,.44,1);

    .modal-main{
        max-width: 90%;
        display: block;
        position: relative;
        top: 50%;
        left: 50%;
        padding: 25px 30px;
        background: #181c1f;
        opacity: 0;
        -webkit-transition: all .3s cubic-bezier(.165,.84,.44,1);
        transition: all .3s cubic-bezier(.165,.84,.44,1);
        box-shadow: 0 0 30px rgba(0,0,0,1);
        -webkit-transform: translate(-50%,-51%) scale(.8) translateZ(0);
        transform: translate(-50%,-51%) scale(.8) translateZ(0);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-transform-origin: center center;
        transform-origin: center center;
        width: 100%;
        float: left;

        @media ${device.tablet} {
          max-width: 550px;
        }

        h3{
            position: relative;
            color: rgba(255,255,255,.5);
            width: 100%;
            text-transform: uppercase;
            margin-bottom: 20px;
            position: relative;
            text-align: center;
            font-size: 1rem;

            @media ${device.tablet} {
              font-size: 1.2rem;
            }

            @media ${device.laptop} {
              font-size: 1.4rem;
            }

            .modal-close{
                width: 24px;
                height: 24px;
                display: block;
                border: 1px solid #fff;
                float: right;
                border-radius: 50%;
                position: relative;
                z-index: 1;
                opacity: .4;
                transition: all .1s ease-in-out;
                -webkit-transition: all .1s ease-in-out;
                -webkit-backface-visibility: hidden;
                cursor: pointer;
                font-family: MullerRegular;
                position: absolute;
                top: 0;
                right: 0;
                
                @media ${device.tablet} {
                  width: 32px;
                  height: 32px;
                }

                &:before{
                    content: '+';
                    color: #fff;
                    position: absolute;
                    z-index: 2;
                    -webkit-transform: rotate(45deg);
                    transform: rotate(45deg);
                    font-size: 30px;
                    line-height: 1;
                    font-family: MullerLight;
                    top: -5px;
                    right: 1px;
                    transition: all .1s ease-in-out;
                    -webkit-transition: all .1s ease-in-out;

                    @media ${device.tablet} {
                      font-size: 37px;
                      right: 2px;
                    }
                }
            }
        }

        .modal-main-box{
          padding: 10px 12px;

          span{
            color: rgba(255,255,255,.5);
          }
        }

        .form-control {
            position: relative;
        }

        .centered{
            text-align: center;
            >*{
                display: inline-block;
            }
        }
    }

    &.open{
        opacity: 1;
        visibility: visible

        .modal-main{
            -webkit-transform: translate(-50%,-51%) scale(1) translateZ(0);
            transform: translate(-50%,-51%) scale(1) translateZ(0);
            opacity: 1;
        }
    }
`;

class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.el = document.createElement('div');

    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    document.body.appendChild(this.el);
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
  }

  handleClose(evt) {
    const { setVisibility } = this.props;
    evt.preventDefault();

    setVisibility(false);
  }

  render() {
    const { children, title, isVisible } = this.props;

    const modalClass = classNames({
      modal: true,
      open: isVisible,
    });

    const modalEle = (<ModalWrapper className={modalClass}>
      <section className="modal-main">
        <h3>
          {title}
          <a className="modal-close" onClick={this.handleClose}></a>
        </h3>
        {children}
      </section>
    </ModalWrapper>);

    return ReactDOM.createPortal(
      modalEle,
      this.el,
    );
  }
}

Modal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  title: PropTypes.string,
  setVisibility: PropTypes.func,
  isVisible: PropTypes.bool,
};

Modal.defaultProps = {
  title: undefined,
  setVisibility: undefined,
  isVisible: false,
};

export default Modal;
