

exports.__esModule = true;

const _extends = Object.assign || function (target) { for (let i = 1; i < arguments.length; i++) { const source = arguments[i]; for (const key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const _createClass = (function () { function defineProperties(target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }());

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { const target = {}; for (const i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError(`Super expression must either be null or a function, not ${typeof superClass}`); } subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass, enumerable: false, writable: true, configurable: true,
    },
  }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

const _react = require('react');
const PropTypes = require('prop-types');

const _react2 = _interopRequireDefault(_react);

const cloudinary = require('./cloudinary');

const CloudinaryImage = (function (_Component) {
  _inherits(CloudinaryImage, _Component);

  function CloudinaryImage() {
    _classCallCheck(this, CloudinaryImage);

    _Component.apply(this, arguments);
  }

  CloudinaryImage.prototype.render = function render() {
    const _props = this.props;
    const publicId = _props.publicId;
    const options = _props.options;

    const other = _objectWithoutProperties(_props, ['publicId', 'options']);

    return _react2.default.createElement('img', _extends({}, other, { src: cloudinary.url(publicId, options) }));
  };

  _createClass(CloudinaryImage, null, [{
    key: 'propTypes',
    value: {
      publicId: PropTypes.string.isRequired,
      options: PropTypes.object,
    },
    enumerable: true,
  }]);

  return CloudinaryImage;
}(_react.Component));

exports.default = CloudinaryImage;
module.exports = exports.default;
