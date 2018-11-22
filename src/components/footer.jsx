import React, { PropTypes } from 'react';
import { Form, Row, Col, Table, Input, InputNumber, Button, Tabs } from 'antd';
import { siteConfig } from '../settings';
import Popup from 'reactjs-popup';

import { cloudinaryConfig, CloudinaryImage } from './react-cloudinary';
cloudinaryConfig({ cloud_name: 'forgelab-io' });

const popupStyle = {
  width: 200, height: 200, background: 'rgba(255, 255, 255, 0.9)', padding: 24, border: 'none', boxShadow: 'rgb(50, 102, 198) 0px 0px 10px', borderRadius: 5,
};

class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div id="footer">
        {/*<div className="contact-container">
          <ul>
            <li>
              <a href={siteConfig.telegramEN}>
                <i className="fa fa-paper-plane-o" />
              </a>
            </li>

            <li>
              <a href={siteConfig.twitter}>
                <i className="fa fa-twitter-square" />
              </a>
            </li>

            <li>
              <Popup
                trigger={() => (
                  <span>
                    <i className="fa fa-weixin" />
                  </span>
                )}
                position="right center"
                on="hover"
                contentStyle={popupStyle}
              >
                <div>
                <CloudinaryImage publicId={siteConfig.wechatQR} options={{ height: 150, crop: 'scale' }} alt="QR code Wechat" />
                </div>
              </Popup>
            </li>
          </ul>
        </div>*/}

        <div div className="corp-container">
          <span>{siteConfig.footerText}</span>
        </div>
      </div>
    );
  }
}

Footer.propTypes = {
};

Footer.defaultProps = {
};

export default Footer;

