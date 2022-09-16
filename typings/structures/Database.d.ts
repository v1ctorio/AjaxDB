import { BaseClient } from './BaseClient';
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
    constructor(options: options);
    protected CheckDatabaseDir(): boolean;
    protected CheckPointersDir(): boolean;
    protected CheckContainersDir(): boolean;
    protected CheckPointer(pointer: string): boolean;
    protected CheckContainer(pointer: string): boolean;
    protected CreatePointers(): Promise<void>;
    protected CreateContainers(): Promise<void>;
    protected writeContainer(container: string, value: object): void;
    protected writePointer(pointer: string, value: object): void;
    findPointer(key: string): Promise<any>;
    findContainer(keyOfPointer: string): Promise<import("bson").Document | undefined>;
    push(key: string, data: dataPush, AUTO_INCREMENT?: boolean): Promise<void>;
    protected sizeContainers(pointer: string): Promise<number>;
    deleteByKey(pointer: string, key: string): Promise<void>;
    get(pointer: string, value: object | any): Promise<object>;
    edit(pointer: string, findKey: object, editKey: editKey): Promise<void>;
    size(): number;
    sizeContainer(pointer: string): number;
    deleteSeveralByKey(pointers: string[], keys: string[]): boolean;
}
export {};
