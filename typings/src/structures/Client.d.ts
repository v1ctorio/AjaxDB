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
    /**
     *
     * @param {object} options - Put database name and path
     */
    constructor(options: options);
    protected CheckAndCreateFolders(): Promise<void>;
    /**
     *
     * @param {string} key - Pointer name
     * @param {string} containerName - Container name
     * @returns void
     */
    CreatePointer(key: string, containerName: string): Promise<void>;
}
export {};
