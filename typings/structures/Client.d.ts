import { Database } from './Database';
declare type options = {
    path: string;
    database: string;
    useEventErr?: boolean;
};
export interface Client {
    database: string;
    shortPath: string;
    options: options;
}
export declare class Client extends Database {
    /**
      * @typedef  {Object}ClientOptions
      * @property {string} path - Path to create ajax_database folder
      * @property {string} database - Database name
      * @property {boolean} useEventErr - (Optional) Use event error or not
    */
    /**
     * @param {ClientOptions} options - Put database name and path
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
