import React from 'react';
import { Popover } from 'antd';
import { injectIntl, intlShape } from 'react-intl';

import SvgIcon from './svg-icons';
import { siteConfig } from '../settings';
import { cloudinaryConfig, CloudinaryImage } from './react-cloudinary';

cloudinaryConfig({ cloud_name: 'forgelab-io' });

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
      wechatImage: undefined,
    };

    this.handleHoverChange = this.handleHoverChange.bind(this);
  }

  componentWillMount() {
    const wechatImage = <CloudinaryImage publicId="qr-wechat-betx" options={{ height: 150, crop: 'scale' }} alt="QR code Wechat" />;
    this.setState({
      wechatImage,
    });
  }

  handleHoverChange = (visible) => {
    this.setState({
      hovered: visible,
    });
  }

  render() {
    const { intl } = this.props;
    const { hovered, wechatImage } = this.state;

    const width = 28;
    const height = 28;

    const iconOptions = {
      height,
      width,
    };

    return (
      <div id="footer">
        <div className="contact-container">
          <ul>
            <li>
              <a href={`mailto:${siteConfig.contactEmail}`}>
                <SvgIcon name="mail" {...iconOptions} />
              </a>
            </li>
            <li>
              <a href={siteConfig.medium} target="_blank">
                <SvgIcon name="medium" {...iconOptions} />
              </a>
            </li>
            <li>
              <a href={siteConfig.telegramEN} target="_blank">
                <SvgIcon name="telegram" {...iconOptions} />
              </a>
            </li>
            <li>
              <a href={siteConfig.twitter} target="_blank">
                <SvgIcon name="twitter" {...iconOptions} />
              </a>
            </li>
            <li>
              <Popover
                placement="top"
                content={wechatImage}
                title={intl.formatMessage({ id: 'footer.contactus.wechat' })}
                trigger="hover"
                visible={hovered}
                onVisibleChange={this.handleHoverChange}
              >
                <span><SvgIcon name="wechat" {...iconOptions} /></span>
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

