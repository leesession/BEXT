import React, { PropTypes } from 'react';
import { Row, Col } from 'antd';
import _ from 'lodash';
import { bounce, pulse } from 'react-animations';
import Radium, { StyleRoot } from 'radium';
import { cloudinaryConfig, CloudinaryImage } from '../../components/react-cloudinary';

cloudinaryConfig({ cloud_name: 'dd1ixvdxn' });

class PortfolioSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const COL_PER_ROW = { // Specify how many col in each row
      xs: 2,
      sm: 4,
    };

    // Calculate grid number for Col attribute
    const colWidth = {};

    Object.keys(COL_PER_ROW).forEach((key) => {
      colWidth[key] = 24 / COL_PER_ROW[key];
    });

    const COL_PER_ROW_ADVISORY = { // Specify how many col in each row
      xs: 2,
      sm: 3,
    };

    // Calculate grid number for Col attribute
    const colWidthAdvisory = {};

    Object.keys(COL_PER_ROW_ADVISORY).forEach((key) => {
      colWidthAdvisory[key] = 24 / COL_PER_ROW_ADVISORY[key];
    });

    return (
      <section>
        <div className="wrapper portfolio" id="portfolio">
          <div className="bg-top-right">
            <CloudinaryImage publicId="upper_right_joutn0" options={{ height: 450, crop: 'scale' }} />
          </div>
          <div className="bg-bot-left">
            <CloudinaryImage publicId="lower_left_3x_glzqxh" options={{ height: 450, crop: 'scale' }} />
          </div>
          <div className="horizontalWrapper">
            <h2 className="underscore">Portfolio</h2>
            <Row gutter={16}>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <ImageContainer href="https://filecoin.io/" cloudinaryId="logo-filecoin" />
                <h4>FIL</h4><p>Filecoin</p></Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div className="img-container">
                  <a href="https://raiden.network/" target="_blank"><CloudinaryImage publicId="logo-rdn" options={{ height: 150, crop: 'scale' }} /></a></div>
                <h4>RDN</h4><p>Raiden Network</p></Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div className="img-container">
                  <a href="https://zeppelinos.org/" target="_blank"><CloudinaryImage publicId="logo-zeppelin" options={{ height: 150, crop: 'scale' }} /></a></div>
                <h4>ZEP</h4><p>Zeppelin_OS</p></Col>
              {/* <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div className="img-container"><CloudinaryImage publicId="logo-0x" options={{ height: 150, crop: 'scale' }} /></div>
                <h4>ZRX</h4><p>0x</p></Col> */}


              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div className="img-container">
                  <a href="https://www.kowala.tech/" target="_blank"><CloudinaryImage publicId="kowala-color_u15mlz" options={{ height: 150, crop: 'scale' }} /></a></div>
                <h4>kUSD</h4><p>Kowala</p></Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div className="img-container">
                  <a href="https://www.nucypher.com/" target="_blank"><CloudinaryImage publicId="nucypher_gmwoi0" style={{ height: '55%' }} options={{ height: 150, crop: 'scale' }} /></a></div>
                <h4>NKMS</h4><p>Nucypher</p></Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div className="img-container">
                  <a href="https://www.thundertoken.com/" target="_blank"><CloudinaryImage publicId="thunder_kytpku" options={{ height: 150, crop: 'scale' }} /></a></div>
                <h4>Thunder Token</h4><p>Thunder</p></Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div className="img-container">
                  <a href="https://urbit.org/" target="_blank"><CloudinaryImage publicId="urbit_zkzxgh" options={{ height: 150, crop: 'scale' }} /></a></div>
                <h4>USP (Urbit Sparks)</h4><p>Urbit</p></Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div className="img-container">
                  <a href="" target="_blank"><CloudinaryImage publicId="logo-keep" style={{ height: '50%' }} options={{ height: 150, crop: 'scale' }} /></a></div>
                <h4>KEEP</h4><p>Keep</p></Col>
            </Row>
            <h2 style={{ marginTop: '2.5em', marginBottom: '1.5em' }}>Advisory Portfolio</h2>
            <Row gutter={16} type="flex">

              <Col
                xs={colWidthAdvisory.xs}
                sm={colWidthAdvisory.sm}
              >
                <div className="img-container">
                  <a href="https://tomochain.com/" target="_blank"><CloudinaryImage publicId="logo-tomochain" options={{ height: 150, crop: 'scale' }} /></a></div>
                <h4>TMC</h4><p>TomoChain</p></Col>

              <Col
                xs={colWidthAdvisory.xs}
                sm={colWidthAdvisory.sm}
              >
                <div className="img-container">
                  <a href="https://havven.io/" target="_blank"><CloudinaryImage publicId="havven_attu3x" style={{ height: '50%' }} options={{ height: 150, crop: 'scale' }} /></a></div>
                <h4>HAV</h4><p>Havven</p></Col>

              <Col
                xs={colWidthAdvisory.xs}
                sm={colWidthAdvisory.sm}
              >
                <div className="img-container">
                  <a href="https://iotex.io/" target="_blank"><CloudinaryImage publicId="logo-iotex" options={{ height: 150, crop: 'scale' }} /></a></div>
                <h4>IOTX</h4><p>IoTex</p></Col>
            </Row>

          </div>


        </div>
      </section>);
  }
}

PortfolioSection.propTypes = {
};

PortfolioSection.defaultProps = {
};

const imageStyles = {
  bounce: {
    animation: 'x 1s',
    animationName: Radium.keyframes(bounce, 'bounce'),
  },
  pulse: {
    animation: 'x 1s',
    animationName: Radium.keyframes(pulse, 'pulse'),
  },
};

class ImageContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      onHover: false,
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter() {
    this.setState({
      onHover: true,
    });
  }

  onMouseLeave() {
    this.setState({
      onHover: false,
    });
  }

  render() {
    const { href, cloudinaryId, style } = this.props;

    const newSize = '102%';
    const originalSize = '100%';

    const imgStyle = _.clone(style);
    if (this.state.onHover) {
      // imgStyle.width = newSize;
      // imgStyle.height = newSize;
    } else {
      // imgStyle.width = originalSize;
      // imgStyle.height = originalSize;
    }

    return (
      <StyleRoot>
        <div className="img-container" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
          <a href={href} target="_blank">
            <CloudinaryImage publicId={cloudinaryId} options={{ height: 150, crop: 'scale' }} style={imgStyle} />
          </a>
        </div >
      </StyleRoot>
    );
  }
}

ImageContainer.propTypes = {
  href: PropTypes.string.isRequired,
  cloudinaryId: PropTypes.string.isRequired,
  style: PropTypes.object,
};

ImageContainer.defaultProps = {
  style: {},
};

// Wrap the component to inject dispatch and state into it
export default PortfolioSection;
