import { Database } from './Database';
declare type options = {
    name: string;
    path: string;
};
export interface Client {
    shortPath: string;
}
export declare class Client extends Database {
    constructor(options: options);
    CreatePointer(key: string, containerName: string): void;
}
export {};
