import React from 'react';
import { Popover } from 'antd';
import { injectIntl, intlShape } from 'react-intl';

import { siteConfig } from '../settings';
import { cloudinaryConfig, CloudinaryImage } from './react-cloudinary';

cloudinaryConfig({ cloud_name: 'forgelab-io' });

class Footer extends React.Component {
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

