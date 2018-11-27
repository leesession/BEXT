import _ from 'lodash';

const DEFAULT_MAX_SIZE = 1000;

class Queue {
  constructor(maxSize) {
    this.elements = [];

    this.setMaxSize(maxSize || DEFAULT_MAX_SIZE);
  }

  /** Set size to a fixed value */
  setMaxSize(value) {
    if (_.isNumber(value) && value > 0) {
      this.capacity = value;
    } else {
      console.log('Queue.setSize', `input is invalid: ${value}`);
    }
  }

  enq(item) {
    if (this.elements.length >= this.capacity) {
      this.deq();
    }

    this.elements.push(item);
  }

  deq() {
    return this.elements.shift();
  }

  /** Return the latest value in queue while keeping it */
  peek() {
    return this.elements[this.elements.length - 1];
  }

  size() {
    return this.elements.length;
  }

  all() {
    return this.elements;
  }

  clean() {
    this.elements = [];
  }
}

export default Queue;
