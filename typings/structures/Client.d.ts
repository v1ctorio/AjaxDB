import { Database } from './Database';
interface options {
    path: string;
    database: string;
    useEventErr?: boolean;
}
export interface Client {
    database: string;
    shortPath: string;
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
