import { BaseClient } from './BaseClient';
declare type options = {
    name: string;
    path: string;
};
export interface Database {
    name: string;
    options: options;
    path: string;
}
export declare class Database extends BaseClient {
    constructor(options: options);
    CreateDatabase(): void;
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
    findContainerData(keyOfPointer: string): import("bson").Document | undefined;
    pushData(key: string, data: object): boolean;
    editKey(pointer: string, key: string, value: unknown): boolean;
    deleteKey(pointer: string, key: string): boolean;
    getDataByKey(pointer: string, key: string): any;
    set(pointer: string, value: object): boolean;
}
export {};
