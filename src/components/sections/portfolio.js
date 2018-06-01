import React, { PropTypes } from 'react';
import { Row, Col } from 'antd';
import _ from 'lodash';
import ScrollReveal from '../scrollReveal';

import { cloudinaryConfig, CloudinaryImage } from '../../components/react-cloudinary';
import ImageContainer from '../imageContainer';

cloudinaryConfig({ cloud_name: 'dd1ixvdxn' });

class PortfolioSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  /**
  * Add event listener
  */
  componentDidMount() {
    // Slide in from right distanct offset
    const isSmall = window.innerWidth < 640;
    const offset = isSmall ? 30 : 40;
    const delay = 200;

    // SlideIn from right
    const revealTop = {
      origin: 'top',
      duration: 600,
      scale: 1,
      easing: 'ease',
      distance: `${offset * 2}px`,
    };

    ScrollReveal.reveal(this.port1, _.extend(revealTop, { delay: isSmall ? 0 : delay * 1 }));
    ScrollReveal.reveal(this.port2, _.extend(revealTop, { delay: isSmall ? delay : delay * 2 }));
    ScrollReveal.reveal(this.port3, _.extend(revealTop, { delay: isSmall ? 0 : delay * 3 }));
    ScrollReveal.reveal(this.port4, _.extend(revealTop, { delay: isSmall ? delay : delay * 4 }));

    ScrollReveal.reveal(this.port5, _.extend(revealTop, { delay: isSmall ? 0 : delay * 1 }));
    ScrollReveal.reveal(this.port6, _.extend(revealTop, { delay: isSmall ? delay : delay * 2 }));
    ScrollReveal.reveal(this.port7, _.extend(revealTop, { delay: isSmall ? 0 : delay * 3 }));
    ScrollReveal.reveal(this.port8, _.extend(revealTop, { delay: isSmall ? delay : delay * 4 }));

    ScrollReveal.reveal(this.port9, _.extend(revealTop, { delay: isSmall ? 0 : delay * 1 }));
    ScrollReveal.reveal(this.port10, _.extend(revealTop, { delay: isSmall ? delay : delay * 2 }));
    ScrollReveal.reveal(this.port11, _.extend(revealTop, { delay: isSmall ? 0 : delay * 3 }));

    ScrollReveal.reveal(this.advisory1, _.extend(revealTop, { delay: isSmall ? 0 : delay * 1 }));
    ScrollReveal.reveal(this.advisory2, _.extend(revealTop, { delay: isSmall ? delay : delay * 2 }));
    ScrollReveal.reveal(this.advisory3, _.extend(revealTop, { delay: isSmall ? 0 : delay * 3 }));
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

    const isSmall = window.innerWidth < 640;

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
              {/* <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div ref={(c) => { this.port1 = c; }}>
                  <ImageContainer href="https://filecoin.io/" cloudinaryId="logo-filecoin" />
                  <h4>FIL</h4><p>Filecoin</p>
                </div>
              </Col> */}
              {/* <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div ref={(c) => { this.port1 = c; }}>
                  <ImageContainer href="https://raiden.network/" cloudinaryId="logo-rdn" />
                  <h4>RDN</h4><p>Raiden Network</p>
                </div>
              </Col> */}
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div ref={(c) => { this.port2 = c; }}>
                  <ImageContainer href="https://zeppelinos.org/" cloudinaryId="logo-zeppelin" />
                  <h4>ZEP</h4><p>Zeppelin_OS</p>
                </div>
              </Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div ref={(c) => { this.port3 = c; }}>
                  <ImageContainer href="https://mycrypto.com/" cloudinaryId="mycrypto_mcu83z" />
                  <h4>&nbsp;</h4><p>MyCrypto</p>
                </div>
              </Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div ref={(c) => { this.port4 = c; }}>
                  <ImageContainer href="https://numer.ai/" cloudinaryId="numerai_ss2p2y" />
                  <h4>NMR</h4><p>Numeraire</p>
                </div>
              </Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div ref={(c) => { this.port5 = c; }}>
                  <ImageContainer href="http://www.ttc.eco/" cloudinaryId="ttc_ravbgx" />
                  <h4>TTC</h4><p>TTC Protocol</p>
                </div>
              </Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div ref={(c) => { this.port6 = c; }}>
                  <ImageContainer href="https://www.libracredit.io/" cloudinaryId="libra-credit_fgpddn" />
                  <h4>LBA</h4><p>Libra Credit</p>
                </div>
              </Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div ref={(c) => { this.port7 = c; }}>
                  <ImageContainer href="https://www.irisnet.org/" cloudinaryId="iris_r2ov9u" />
                  <h4>IRIS</h4><p>IRIS Network</p>
                </div>
              </Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div ref={(c) => { this.port8 = c; }}>

                  <ImageContainer href="https://www.nucypher.com/" cloudinaryId="nucypher_gmwoi0" style={{ height: isSmall ? '35%' : '55%' }} />
                  <h4>NKMS</h4><p>Nucypher</p>
                </div>
              </Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div ref={(c) => { this.port9 = c; }}>
                  <ImageContainer href="https://www.thundertoken.com/" cloudinaryId="thunder_kytpku" />
                  <h4>Thunder Token</h4><p>Thunder</p>
                </div>
              </Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div ref={(c) => { this.port10 = c; }}>
                  <ImageContainer href="https://urbit.org/" cloudinaryId="urbit_zkzxgh" />
                  <h4>USP (Urbit Sparks)</h4><p>Urbit</p>
                </div>

              </Col>
              <Col
                xs={colWidth.xs}
                sm={colWidth.sm}
              >
                <div ref={(c) => { this.port11 = c; }}>
                  <ImageContainer href="https://keep.network/" cloudinaryId="logo-keep" style={{ height: isSmall ? '35%' : '50%' }} />
                  <h4>KEEP</h4><p>Keep Network</p>
                </div>

              </Col>
            </Row>
            <h2 style={{ marginTop: '2.5em', marginBottom: '1.5em' }} className="underscore">Advisory Portfolio</h2>
            <Row gutter={16} type="flex">

              <Col
                xs={colWidthAdvisory.xs}
                sm={colWidthAdvisory.sm}
              >
                <div ref={(c) => { this.advisory1 = c; }}>
                  <ImageContainer href="https://tomochain.com/" cloudinaryId="logo-tomochain" />
                  <h4>TMC</h4><p>TomoChain</p>
                </div>

              </Col>

              {/* <Col
                xs={colWidthAdvisory.xs}
                sm={colWidthAdvisory.sm}
              >
                <div ref={(c) => { this.advisory2 = c; }}>
                  <ImageContainer href="https://havven.io/" cloudinaryId="havven_attu3x" style={{ height: isSmall ? '30%' : '50%' }} />
                  <h4>HAV</h4><p>Havven</p>
                </div>
              </Col> */}

              <Col
                xs={colWidthAdvisory.xs}
                sm={colWidthAdvisory.sm}
              >
                <div ref={(c) => { this.advisory2 = c; }}>
                  <ImageContainer href="https://iotex.io" cloudinaryId="logo-iotex" />
                  <h4>IOTX</h4><p>IoTex</p>
                </div>
              </Col>
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

// Wrap the component to inject dispatch and state into it
export default PortfolioSection;
