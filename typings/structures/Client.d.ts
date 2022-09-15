import { Database } from './Database';
declare type options = {
    database: string;
    path: string;
};
export interface Client {
    shortPath: string;
    database: string;
}
export declare class Client extends Database {
    constructor(options: options);
    CreatePointer(key: string, containerName: string): void;
}
export {};
