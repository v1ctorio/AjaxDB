import fs from 'fs';
import { BaseClient } from './BaseClient';
import { Database } from './Database';
import BSON from 'bson';

type options = {
  database: string;
  path: string;
  useEventErr?: boolean;
}

export interface Client {
  shortPath: string;
  database: string;
  options: options;
}

export class Client extends Database {
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

  public async CreatePointer(key: string, containerName: string) {
    if (fs.existsSync(`${this.path}/ajax_databases/${this.database}/pointers/${key}.bson`)) return;
    if (fs.existsSync(`${this.path}/ajax_databases/${this.database}/containers/${containerName}.bson`)) return;

    const pointerData = {
      "key": key,
      "container": `${containerName}`
    }
    const containerData = {
      "pointer": key,
      "containers": [] 
    }
    
    await fs.promises.mkdir(`${this.path}/ajax_databases/${this.database}/pointers`, { recursive: true })
      .then(async (x) => {
        await fs.promises.writeFile(`${this.shortPath}/pointers/${key}.bson`, BSON.serialize(pointerData));
      }).catch((err) => this.emit("error", err));
    await fs.promises.mkdir(`${this.path}/ajax_databases/${this.database}/containers`, { recursive: true })
      .then(async (x) => {
        await fs.promises.writeFile(`${this.shortPath}/containers/${containerName}.bson`, BSON.serialize(containerData)).catch(err => console.error(err));
      }).catch((err) => this.emit("error", err));
    return;
  }
}
