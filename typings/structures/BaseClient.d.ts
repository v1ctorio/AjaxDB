/// <reference types="node" />
import { EJSON } from 'bson';
import { EventEmitter } from 'node:events';
/**
 * @type {ejson} EJSON
 */
declare type ejson = typeof EJSON;
/**
 * @typedef {(string|number|object|undefined)} ErrorClient
 */
declare type ErrorClient = string | number | object | undefined;
export interface BaseClient {
    ejson: ejson;
    /**
     * @param event
     * @param listener
     */
    on(event: 'error', listener: (error: ErrorClient) => void): this;
    on(event: 'start', listener: () => void): this;
}
/**
 * @constructor
 * @ejson EJSON method.
 */
export declare class BaseClient extends EventEmitter {
    constructor();
}
export {};
