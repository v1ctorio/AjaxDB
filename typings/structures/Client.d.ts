import { Database } from './Database';
declare type options = {
    database: string;
    path: string;
    useEventErr?: boolean;
};
export interface Client {
    shortPath: string;
    database: string;
    options: options;
}
export declare class Client extends Database {
    constructor(options: options);
    CreatePointer(key: string, containerName: string): void;
}
export {};
