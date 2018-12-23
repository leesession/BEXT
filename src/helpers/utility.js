import _ from 'lodash';
const fetch = require('node-fetch');

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
 * @param  {number} x e.g. 1000000.65
 * @return {string}   "1,000,000.65"
 */
export function formatNumberThousands(x) {
  if (_.isUndefined(x)) {
    return x;
  }

  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
