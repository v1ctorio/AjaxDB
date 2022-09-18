import fs from 'node:fs';

import BSON from 'bson';

import { BaseClient } from './BaseClient';
import { Database   } from './Database';

/**
 * @typedef ClientOptions
 * @type {object}
 * @property {string} path - Path to create ajax_database folder
 * @property {string} database - Database name
 * @property {boolean} useEventErr - (Optional) Use event error or not
 */
type options = {

  path:     string
  database: string

  useEventErr?: boolean
};

export interface Client {

  database:  string
  shortPath: string

  options: options
}

export class Client extends Database {
  /**
   * 
   * @param {ClientOptions} options - Put database name and path 
   */
  constructor(options: options) {
    super({ database: options.database, path: options.path });
    if(this.path.endsWith("/")) this.path = this.path.slice(0, -1);
    this.options = options;
    this.shortPath = this.path + "/ajax_databases/" + options.database;
    this.database = options.database;
      
    if(!fs.existsSync(this.path)) {
      throw new Error("Path is not exists");
    }

    this.CheckAndCreateFolders();

    this.emit('start');
  }
  
  protected async CheckAndCreateFolders() {

    if(!fs.existsSync(this.path+"/ajax_databases/")) {
      await fs.promises.mkdir(this.path+"/ajax_databases/", {recursive: true}).catch((err) => {
        if (err) this.emit("error", err);
      });
    }

    if(!fs.existsSync(this.shortPath)) {
      await fs.promises.mkdir(this.shortPath, {recursive: true}).catch((e) => this.emit("error", e));
    }
    
    if(!fs.existsSync(this.path + "/ajax_databases/" + this.database + "/pointers")) {
      await this.CreatePointers();
    }

    if(!fs.existsSync(this.shortPath+"/containers")){
      await this.CreateContainers();
    }

  }

  /**
   * 
   * @param {string} key - Pointer name
   * @param {string} containerName - Container name
   * @returns void
   */
  public async CreatePointer(key: string, containerName: string) {

    if (fs.existsSync(`${this.path}/ajax_databases/${this.database}/pointers/${key}.bson`)) return;
    if (fs.existsSync(`${this.path}/ajax_databases/${this.database}/containers/${containerName}.bson`)) return;

    const pointerData = BSON.serialize({
      "key": key,
      "container": `${containerName}`
    });
    const containerData = BSON.serialize({
      "pointer": key,
      "containers": [] 
    });
    
    await fs.promises
      .mkdir(`${this.path}/ajax_databases/${this.database}/pointers`, { recursive: true })
      .then(async (x) => {
  
        await fs.promises.writeFile(`${this.shortPath}/pointers/${key}.bson`, pointerData);
      })
      .catch((err) => console.error(err));

    await fs.promises.mkdir(`${this.path}/ajax_databases/${this.database}/containers`, { recursive: true })
      .then(async (x) => {
        await fs.promises.writeFile(`${this.shortPath}/containers/${containerName}.bson`, containerData);
      })
      .catch((err) => console.error(err));
  }
}
