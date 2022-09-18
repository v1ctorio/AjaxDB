import { EJSON } from 'bson';
import { EventEmitter } from 'node:events';

/**
 * @type {ejson} EJSON
 */
type ejson = typeof EJSON;

type ErrorClient = string | number | object | undefined;

export interface BaseClient {
  ejson: ejson;
  /**
 * @typedef {(string|number|Object|undefined)} ErrorClient
 */

  /**
   * @param {string} event - Event name
   * @param {function} listener - Listener function
   * @param {ErrorClient} error - ErrorClient data
   */
  on(event: 'error', listener: (error: ErrorClient) => void): this;
  on(event: 'start', listener: () => void): this;
}

/**
 * @constructor
 * @ejson EJSON method.
 */
export class BaseClient extends EventEmitter {
  constructor() {
    super();
    this.ejson = EJSON;
  }
}
