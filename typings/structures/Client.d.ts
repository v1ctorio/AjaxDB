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
    protected CheckAndCreateFolders(): Promise<void>;
    CreatePointer(key: string, containerName: string): Promise<void>;
}
export {};
