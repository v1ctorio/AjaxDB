import fs from 'fs';
import { BaseClient } from './BaseClient';
import { Database } from './Database';
import BSON from 'bson';

type options = {
  database: string;
  path: string;
}


export interface Client {
  shortPath: string;
  database: string;
}

export class Client extends Database {
  constructor(options: options) {
    super({ database: options.database, path: options.path });
    if(this.path.endsWith("/")) this.path = this.path.slice(0, -1);
    this.shortPath = this.path + "/ajax_databases/" + options.database;
    this.database = options.database;
      
    if(!fs.existsSync(this.path)) {
      throw new Error("Path is not exists");
    }

    if(!fs.existsSync(this.path+"/ajax_databases/")) {
      fs.mkdir(this.path+"/ajax_databases/", (err) => {
        if (err) return console.log(err);
      });
    }

    if(!fs.existsSync(this.shortPath)) {
      fs.mkdir(this.shortPath, (err) => {
        if (err) return console.error(err);
      });
    }
    
    if(!fs.existsSync(this.path + "/ajax_databases/" + this.database + "/pointers")) {
      this.CreatePointers();
    }
  }
  
  public CreatePointer(key: string, containerName: string) {
    if (!this.CheckContainersDir()) this.CreateContainers();
    if (!this.CheckPointersDir()) this.CreatePointers();
    if (fs.existsSync(`${this.path}/ajax_databases/${this.database}/pointers/${key}.bson`)) console.error("Pointer is exist");
    if (fs.existsSync(`${this.path}/ajax_databases/${this.database}/containers/${containerName}.bson`)) throw new Error("Container is exist");

    const pointerData = {
      "key": key,
      "container": `${containerName}`
    }
    const containerData = {
      "pointer": key,
    }

    fs.writeFileSync(`${this.path}/ajax_databases/${this.database}/pointers/${key}.bson`, BSON.serialize(pointerData));
    fs.writeFileSync(`${this.path}/ajax_databases/${this.database}/containers/${containerName}.bson`, BSON.serialize(containerData));

    return;
  }
}
