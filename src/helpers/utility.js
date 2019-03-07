import _ from 'lodash';
const fetch = require('node-fetch');
const assert = require('assert');

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export function request(url, options) {
  return fetch(url, options)
    .then(parseJSON)
    .then(checkStatus);
}

/**
 * Returns resolved Promise if Http response contains result; otherwise returns rejected upon error.
 *
 * @param  {object} response   JSON response from a HTTP request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  // We can rely on checking error object so dont check HTTP status code here.
  if (response.error) {
    throw new Error(response.error);
  } else {
    return response.result;
  }
}

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  return response.json();
}

// Returns a new random alphanumeric string of the given size.
//
// Note: to simplify implementation, the result has slight modulo bias,
// because chars length of 62 doesn't divide the number of all bytes
// (256) evenly. Such bias is acceptable for most cases when the output
// length is long enough and doesn't need to be uniform.
export function randomString(size) {
  if (size === 0) {
    throw new Error('Zero-length randomString is useless.');
  }
  const chars = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'abcdefghijklmnopqrstuvwxyz' +
    '0123456789');

  let result = '';

  for (let i = size; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

export function parseQuery(queryString) {
  const query = {};

  if (queryString.length === 0) {
    return query;
  }

  const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}


export function assertDefined(...args) {
  if (args.length < 2 || _.isUndefined(args[1])) {
    // array[0] - methodName
    // array[1] - message
    const array = args.slice(0, 1);
    array[1] = `${args.length >= 3 ? args[2] : 'variable'} is not defined...`;
    throw new Error(array);
  }
}

/**
 * Returns a float number with a {digits} number of digits after decimal point
 * e.g. getFixedFloat(0.1224, 2) returns 0.12
 * @param  {string || number} val    Value of the input to be processed
 * @param  {number} digits number of digit after decimal point
 * @return {number}
 */
export function getFixedFloat(val, digits) {
  assertDefined('utils.getFixedFloat', digits, 'digits');

  if (val[val.length - 1] === '.') {
    return val;
  }

  let result;
  if (typeof val === 'number') {
    result = val;
  } else if (typeof val === 'string') {
    result = parseFloat(val);
  }

  const magnifier = 10 ** digits;
  return Math.trunc(result * magnifier) / magnifier;
}

export function millisecToMin(millis) {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

/**
 * Formatting number with thousand separator.
 * @param  {number} num e.g. 1000000.65
 * @return {string}   "1,000,000.65"
 */
export function formatNumberThousands(num) {
  if (_.isUndefined(num)) {
    return num;
  }

  const numStr = num.toString();
  const parts = numStr.split('.');

  const decimalStr = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const period = _.isUndefined(parts[1]) ? '' : '.';
  const floatStr = _.isUndefined(parts[1]) ? '' : parts[1];

  return `${decimalStr}${period}${floatStr}`;
}

/**
 * Usage: await delay(1000)
 * @param  {[type]} ms) [description]
 * @return {[type]}     [description]
 */
export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Convert a number of secend to an object containing days, hours, minutes and seconds
 * @param  {[type]} secs [description]
 * @return {[type]}      [description]
 */
export function secondsToTime(secs) {
  const days = Math.floor(secs / 86400);
  let numSeconds = secs % 86400;
  const hours = Math.floor(numSeconds / 3600);
  numSeconds %= 3600;
  const minutes = Math.floor(numSeconds / 60);
  const seconds = Math.ceil(numSeconds % 60);

  const obj = {
    d: days,
    h: hours,
    m: minutes,
    s: seconds,
  };

  return obj;
}

/**
 * Get Rest of the miliseconds to the end of the day
 * @param  {number} zone [description]
 * @return {[type]}      [description]
 */
export function getRestDaySeconds(numTimezone) {
  if (!_.isNumber(numTimezone)) {
    return 0;
  }

  const d = new Date();
  const len = d.getTime();
  const offset = d.getTimezoneOffset() * 60000;
  const utcTime = len + offset;
  const newDate = new Date(utcTime + (3600000 * numTimezone));
  const currentSeconds = (newDate.getHours() * 3600) + (newDate.getMinutes() * 60) + newDate.getSeconds();

  return (86400 - currentSeconds);
}


/**
  Normalize and validate decimal string (potentially large values).  Should
  avoid internationalization issues if possible but will be safe and
  throw an error for an invalid number.
  Normalization removes extra zeros or decimal.
  @return {string} value
*/
function DecimalString(input) {
  let value = input;

  assert(value != null, 'value is required');
  value = value === 'object' && value.toString ? value.toString() : String(value);

  const neg = /^-/.test(value);
  if (neg) {
    value = value.substring(1);
  }

  if (value[0] === '.') {
    value = `0${value}`;
  }

  const part = value.split('.');
  assert(part.length <= 2, `invalid decimal ${value}`);
  assert(/^\d+(,?\d)*\d*$/.test(part[0]), `invalid decimal ${value}`);

  if (part.length === 2) {
    assert(/^\d*$/.test(part[1]), `invalid decimal ${value}`);
    part[1] = part[1].replace(/0+$/, '');// remove suffixing zeros
    if (part[1] === '') {
      part.pop();
    }
  }

  part[0] = part[0].replace(/^0*/, '');// remove leading zeros
  if (part[0] === '') {
    part[0] = '0';
  }
  return (neg ? '-' : '') + part.join('.');
}

/**
  Ensure a fixed number of decimal places.  Safe for large numbers.
  @see ./format.test.js
  @example DecimalPad(10.2, 3) === '10.200'
  @arg {number|string|object.toString} num
  @arg {number} [precision = null] - number of decimal places.  Null skips
    padding suffix but still applies number format normalization.
  @return {string} decimal part is added and zero padded to match precision
*/
function DecimalPad(num, precision) {
  const value = DecimalString(num);
  if (precision == null) {
    return value;
  }

  assert(precision >= 0 && precision <= 18, 'Precision should be 18 characters or less');

  const part = value.split('.');

  if (precision === 0 && part.length === 1) {
    return part[0];
  }

  if (part.length === 1) {
    return `${part[0]}.${'0'.repeat(precision)}`;
  }
  const pad = precision - part[1].length;
  assert(pad >= 0, `decimal '${value}' exceeds precision ${precision}`);
  return `${part[0]}.${part[1]}${'0'.repeat(pad)}`;
}

/** @private for now, support for asset strings is limited
*/
function printAsset({
  amount, precision, symbol, contract,
}) {
  assert.equal(typeof symbol, 'string', 'symbol is a required string');

  let newAmount = amount;

  if (amount != null && precision != null) {
    newAmount = DecimalPad(amount, precision);
  }

  const join = (e1, e2) => {
    if (e1 === null) {
      return '';
    } else if (e2 === null) {
      return '';
    }
    return e1 + e2;
  };

  if (newAmount != null) {
    // the amount contains the precision
    return join(newAmount, ' ') + symbol + join('@', contract);
  }

  return join(precision, ',') + symbol + join('@', contract);
}

/**
  Attempts to parse all forms of the asset strings (symbol, asset, or extended
  versions).  If the provided string contains any additional or appears to have
  invalid information an error is thrown.
  @return {object} {amount, precision, symbol, contract}
  @throws AssertionError
*/
export function parseAsset(str) {
  const [amountRaw] = str.split(' ');
  const amountMatch = amountRaw.match(/^(-?[0-9]+(\.[0-9]+)?)( |$)/);
  const amount = amountMatch ? amountMatch[1] : null;

  const precisionMatch = str.match(/(^| )([0-9]+),([A-Z]+)(@|$)/);
  const precisionSymbol = precisionMatch ? Number(precisionMatch[2]) : null;
  const precisionAmount = amount ? (amount.split('.')[1] || '').length : null;
  const precision = precisionSymbol != null ? precisionSymbol : precisionAmount;

  const symbolMatch = str.match(/(^| |,)([A-Z]+)(@|$)/);
  const symbol = symbolMatch ? symbolMatch[2] : null;

  const [, contractRaw = ''] = str.split('@');
  const contract = /^[a-z0-5]+(\.[a-z0-5]+)*$/.test(contractRaw) ? contractRaw : null;

  const check = printAsset({
    amount, precision, symbol, contract,
  });

  assert.equal(str, check, `Invalid asset string: ${str} !== ${check}`);

  if (precision != null) {
    assert(precision >= 0 && precision <= 18, 'Precision should be 18 characters or less');
  }
  if (symbol != null) {
    assert(symbol.length <= 7, 'Asset symbol is 7 characters or less');
  }
  if (contract != null) {
    assert(contract.length <= 12, 'Contract is 12 characters or less');
  }

  return {
    amount, precision, symbol, contract,
  };
}

/**
 * Trim ending zeros in an asset string
 * @param {number}
 * @return {[type]} [description]
 */
export function trimZerosFromAsset(quantity, digits = 4) {
  if (quantity === '') {
    return quantity;
  }

  const { amount, symbol } = parseAsset(quantity);

  let trimmed = _.floor(amount, digits);
  trimmed = trimmed.toFixed(digits);

  return `${trimmed} ${symbol}`;
}

export function getRestSecondsOfTheHour() {
  const dateNow = new Date();
  return 3600 - ((dateNow.getMinutes() * 60) + dateNow.getSeconds());
}

/**
 * Insert an item to the front of the list, and remove the last if length is already at the max
 * @param {array}  list existing list
 * @param {object} item
 * @param {number} maxLen length of array
 * @return {[type]} [description]
 */export function enqueue(list, item, maxLen) {
  if (_.isUndefined(list)) {
    return;
  }

  if (list.length >= maxLen) { // Remove the last element if list is already at max length
    list.pop();
  }

  list.unshift(item); // Add the new bet from the front
}
