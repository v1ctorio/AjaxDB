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
    protected CreatePointers(): void;
    protected CreateContainers(): void;
    protected writeContainer(container: string, value: object): void;
    protected writePointer(pointer: string, value: object): void;
    findPointer(key: string): any;
    findContainer(keyOfPointer: string): import("bson").Document | undefined;
    push(key: string, data: dataPush, AUTO_INCREMENT?: boolean): boolean;
    protected sizeContainers(pointer: string): number;
    deleteByKey(pointer: string, key: string): boolean;
    get(pointer: string, value: object): undefined;
    edit(pointer: string, findKey: object, editKey: editKey): void;
    size(): number;
    sizeContainer(pointer: string): number;
    deleteSeveralByKey(pointers: string[], keys: string[]): boolean;
}
export {};
