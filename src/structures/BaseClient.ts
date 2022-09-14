import BSON, { EJSON } from 'bson';
import { EventEmitter } from 'node:events';
import fs from 'fs';

type ejson = typeof EJSON;

export interface BaseClient {
  ejson: ejson;
  data: Map<string | number, object>;
}

export class BaseClient extends EventEmitter {
  constructor() {
    super();
    this.data = new Map();
    this.ejson = EJSON;
  }
  
  public find(key: string | number) {
    
  }
}
