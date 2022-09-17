import { BaseClient } from './BaseClient';
import { Document } from 'bson';
declare type options = {
    database: string;
    path: string;
};
export interface Database {
    database: string;
    options: options;
    path: string;
}
declare type dataPush = {
    id?: string | number;
    content: object;
};
declare type editKey = {
    key: string;
    value: string;
};
export declare class Database extends BaseClient {
    /**
     * @constructor
     * @param {object} options - Put database name and path
     */
    constructor(options: options);
    /**
     * @protected
     * @description Check if the "ajax_databases" directory exists
     * @returns boolean
     */
    protected CheckDatabaseDir(): boolean;
    /**
     * @protected
     * @description Check if the "pointers" directory exists
     * @returns boolean
     */
    protected CheckPointersDir(): boolean;
    /**
     * @protected
     * @description Check if the "containers" directory exists
     * @returns boolean
     */
    protected CheckContainersDir(): boolean;
    /**
     * @protected
     * @description Check if the pointer file exists
     * @param {string} pointer - Pointer name
     * @returns boolean
     */
    protected CheckPointer(pointer: string): boolean;
    /**
     * @protected
     * @description Check if the container file exists
     * @param {string} pointer - Pointer name
     * @returns boolean
     */
    protected CheckContainer(pointer: string): boolean;
    /**
     * @protected
     * @async
     * @description Create pointers folder
     * @returns void
     */
    protected CreatePointers(): Promise<void>;
    /**
     * @protected
     * @async
     * @description Create containers folder
     * @returns void
     */
    protected CreateContainers(): Promise<void>;
    /**
     * @protected
     * @description Write container file
     * @param {string} container - container name
     * @param {object} value - Container new data
     */
    protected writeContainer(container: string, value: object): void;
    /**
     * @protected
     * @description write container pointer
     * @param {string} pointer - Pointer name
     * @param {object} value  - Pointer new data
     */
    protected writePointer(pointer: string, value: object): void;
    /**
     * @protected
     * @async
     * @description Find pointer information
     * @param {string} key - Key to find pointer information
     * @returns object
     */
    protected findPointer(key: string): Promise<Document>;
    /**
     * @protected
     * @async
     * @description Find container information
     * @param {string} keyOfPointer - Pointer name
     * @returns object
     */
    protected findContainer(keyOfPointer: string): Promise<Document | undefined>;
    /**
     * @public
     * @async
     * @description Push the data to the container
     * @param {string} key - Pointer name
     * @param {object} data - Data to be pushed
     * @param AUTO_INCREMENT
     */
    push(key: string, data: dataPush, AUTO_INCREMENT?: boolean): Promise<void>;
    /**
     * @protected
     * @async
     * @description Count the containers
     * @param {string} pointer - Pointer name
     * @returns number
     */
    protected sizeContainers(pointer: string): Promise<number>;
    /**
     * @public
     * @async
     * @description Delete multiple keys together
     * @param {array} pointers - Pointers name
     * @param {array} keys  - Keys name
     */
    deleteSeveralByKey(pointers: string[], keys: string[]): Promise<void>;
    /**
     * @public
     * @async
     * @description Delete keys
     * @param {string} pointer - Pointer name
     * @param {string} key - Key name
     */
    deleteByKey(pointer: string, key: string): Promise<void>;
    /**
     * @public
     * @async
     * @description Get container data
     * @param {string} pointer - Pointer name
     * @param {object} value - Data to be find for in the container
     * @returns object
     */
    get(pointer: string, value: object | any): Promise<object>;
    /**
     * @public
     * @async
     * @description Edit data container
     * @param {string} pointer - Pointer name
     * @param {object} findKey - Find key data
     * @param {object} editKey - Edit key data
     */
    edit(pointer: string, findKey: object, editKey: editKey): Promise<void>;
    /**
     * @public
     * @description Count the pointers
     * @returns number
     */
    size(): number;
    /**
     * @public
     * @description Count the containers in containers folder
     * @param {string} pointer - Pointer name
     * @returns number
     */
    sizeContainer(pointer: string): number | undefined;
}
export {};
