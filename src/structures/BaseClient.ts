import { EJSON } from 'bson';
import { EventEmitter } from 'node:events';

type ejson = typeof EJSON;

type ErrorClient = string | number | object | undefined;

export interface BaseClient {
  ejson: ejson;
  on(event: 'error', listener: (error: ErrorClient) => void): this;
  on(event: 'start', listener: () => void): this;
}

export class BaseClient extends EventEmitter {
  constructor() {
    super();
    this.ejson = EJSON;
  }
}
