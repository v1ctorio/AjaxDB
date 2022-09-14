import fs from 'fs';
import { BaseClient } from './BaseClient';
import { Database } from './Database';
import BSON from 'bson';

type options = {
  path: string;
}


export interface Client {
  shortPath: string;
}

export class Client extends Database {
  constructor(options: options) {
    super({ path: options.path });
    if(this.path.endsWith("/")) this.path = this.path.slice(0, -1);
    this.shortPath = this.path + "/ajax_databases/" + this.database;
      
    if(!fs.existsSync(this.path)) {
      throw new Error("Path is not exists");
    }

    if(!fs.existsSync(this.path+"/ajax_databases/")) {
      fs.mkdir(this.path+"/ajax_databases/", (err) => {
        if (err) return console.log(err);
      });
    }
    
    if(!fs.existsSync(this.path + "/ajax_databases/" + this.database + "/pointers")) {
      this.CreatePointers();
    }
  }
  
  public CreatePointer(key: string, containerName: string) {
    if(fs.existsSync(this.shortPath + `/pointers/${key}.bson`)) {
      throw new Error("Pointer is exists");
    }
    if (fs.existsSync(this.shortPath + `/containers/${containerName}.bson`)) {
      throw new Error("Container is exists");
    }

    const pointerData = {
      "key": key,
      "container": `${containerName}`
    }
    const containerData = {
      "pointer": key,
    }

    fs.writeFileSync(this.shortPath + `/pointers/${key}.bson`, BSON.serialize(pointerData));
    fs.writeFileSync(this.shortPath + `/containers/${containerName}.bson`, BSON.serialize(containerData));

    return;
  }

}
