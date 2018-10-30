import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Modal from '../../components/feedback/modal';
import Button from '../../components/uielements/button';
import actions from '../../redux/languageSwitcher/actions';
import config from './config';

const { switchActivation, changeLanguage } = actions;

class LanguageSwitcher extends Component {
  render() {
    const {
      isActivated,
      language,
      switchActivationReq,
      changeLanguageReq,
    } = this.props;
    return (
      <div className="isoButtonWrapper">
        <Button type="primary" className="" onClick={switchActivationReq}>
          Switch Language
        </Button>

        <Modal
          title="Select Language"
          visible={isActivated}
          onCancel={switchActivationReq}
          cancelText="Cancel"
          footer={[]}
        >
          <div>
            {config.options.map((option) => {
              const { languageId, text } = option;
              const type = languageId === language.languageId ? 'primary' : 'success';
              return (
                <Button
                  type={type}
                  key={languageId}
                  onClick={() => {
                    changeLanguageReq(languageId);
                  }}
                >
                  {text}
                </Button>
              );
            })}
          </div>
        </Modal>
      </div>
    );
  }
}

LanguageSwitcher.propTypes = {
  switchActivationReq: PropTypes.func,
  changeLanguageReq: PropTypes.func,
  isActivated: PropTypes.bool,
  language: PropTypes.object,
};

LanguageSwitcher.defaultProps = {
  switchActivationReq: undefined,
  changeLanguageReq: undefined,
  isActivated: false,
  language: undefined,
};

export default connect(
  (state) => ({
    ...state.LanguageSwitcher,
  }),
  {
    switchActivationReq: switchActivation,
    changeLanguageReq: changeLanguage,
  },
)(LanguageSwitcher);
