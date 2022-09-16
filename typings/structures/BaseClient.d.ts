/// <reference types="node" />
import { EJSON } from 'bson';
import { EventEmitter } from 'node:events';
import { Client } from './Client';
declare type ejson = typeof EJSON;
declare type ErrorClient = string | number | object | undefined;
export interface BaseClient {
    ejson: ejson;
    on(event: 'error', listener: (error: ErrorClient) => void): this;
    on(event: 'start', listener: (data?: Client) => void): this;
}
export declare class BaseClient extends EventEmitter {
    constructor();
}
export {};
