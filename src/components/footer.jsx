import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Input, Button, Popover } from 'antd';
import { injectIntl, intlShape } from 'react-intl';

import IntlMessages from './utility/intlMessages';
import { siteConfig } from '../settings';
import { cloudinaryConfig, CloudinaryImage } from './react-cloudinary';

cloudinaryConfig({ cloud_name: 'forgelab-io' });

const popupStyle = {
  width: 200, height: 200, background: 'rgba(255, 255, 255, 0.9)', padding: 24, border: 'none', boxShadow: 'rgb(50, 102, 198) 0px 0px 10px', borderRadius: 5,
};

class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({ open: true });
  }
  closeModal() {
    this.setState({ open: false });
  }

  render() {
    const { intl } = this.props;

    return (
      <div id="footer">
        <div className="contact-container">

          <ul>
            <li>
              <a href={`mailto:${siteConfig.contactEmail}`}>
                <i className="fa fa-envelope-o" />
              </a>
            </li>
            <li>
              <a href={siteConfig.telegramEN}>
                <i className="fa fa-paper-plane-o" />
              </a>
            </li>
            <li>
              <a href={siteConfig.twitter} target="_blank">
                <i className="fa fa-twitter" />
              </a>
            </li>
            <li>
              {/*              <Popup
                trigger={() => (
                  <span>
                    abdfdfss
                  </span>
                )}
                on="hover"
                contentStyle={popupStyle}
              >
                <CloudinaryImage publicId="qr-wechat-betx" options={{ height: 150, crop: 'scale' }} alt="QR code Wechat" />
              </Popup> */}
              <Popover content={<CloudinaryImage publicId="qr-wechat-betx" options={{ height: 150, crop: 'scale' }} alt="QR code Wechat" />} title={intl.formatMessage({ id: 'footer.contactus.wechat' })}>
                <span><i className="fa fa-wechat" /></span>
              </Popover>
            </li>
          </ul>

        </div>

        <div className="corp-container">
          <span>{siteConfig.footerText}</span>
        </div>
      </div>
    );
  }
}

Footer.propTypes = {
  intl: intlShape.isRequired,
};

Footer.defaultProps = {
};

export default injectIntl(Footer);

