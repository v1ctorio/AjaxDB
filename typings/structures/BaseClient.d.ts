/// <reference types="node" />
import { EJSON } from 'bson';
import { EventEmitter } from 'node:events';
declare type ejson = typeof EJSON;
export interface BaseClient {
    ejson: ejson;
    data: Map<string | number, object>;
}
export declare class BaseClient extends EventEmitter {
    constructor();
    find(key: string | number): void;
}
export {};
