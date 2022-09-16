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

    if(!fs.existsSync(this.path+"/ajax_databases/")) {
      fs.promises.mkdir(this.path+"/ajax_databases/", {recursive: true}).catch((err) => {
        if (err) this.emit("error", err);
      });
    }

    if(!fs.existsSync(this.shortPath)) {
      fs.promises.mkdir(this.shortPath, {recursive: true}).catch((e) => this.emit("error", e));
    }
    
    if(!fs.existsSync(this.path + "/ajax_databases/" + this.database + "/pointers")) {
      this.CreatePointers();
    }

    if(!fs.existsSync(this.shortPath+"/containers")){
      this.CreateContainers();
    }

    this.emit('start', { options: this.options, database: this.database, shortPath: this.shortPath });
  }
  
  public CreatePointer(key: string, containerName: string) {
    if (fs.existsSync(`${this.path}/ajax_databases/${this.database}/pointers/${key}.bson`)) throw new Error("Pointer is exist");
    if (fs.existsSync(`${this.path}/ajax_databases/${this.database}/containers/${containerName}.bson`)) throw new Error("Container is exist");

    const pointerData = {
      "key": key,
      "container": `${containerName}`
    }
    const containerData = {
      "pointer": key,
      "containers": [] 
    }
    
    fs.promises.mkdir(`${this.path}/ajax_databases/${this.database}/pointers`, { recursive: true })
      .then((x) => {
        fs.promises.writeFile(`${this.shortPath}/pointers/${key}.bson`, BSON.serialize(pointerData));
      }).catch((err) => this.emit("error", err));
    fs.promises.mkdir(`${this.path}/ajax_databases/${this.database}/containers`, { recursive: true })
      .then((x) => {
        fs.promises.writeFile(`${this.shortPath}/containers/${containerName}.bson`, BSON.serialize(containerData));
      }).catch((err) => this.emit("error", err);
    return;
  }
}
