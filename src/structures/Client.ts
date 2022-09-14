import fs from 'fs';
import { BaseClient } from './BaseClient';
import { Database } from './Database';
import BSON from 'bson';

type options = {
  name: string;
  path: string;
}


export interface Client {
  shortPath: string;
}

export class Client extends Database {
  constructor(options: options) {
    super({name: options.name, path: options.path});    
    this.shortPath = this.path + "/" + this.options.name;
      
    if(!fs.existsSync(this.path)) {
      throw new Error("Path is not exists");
    }
    
    if(!fs.existsSync(this.path + "/" + this.options.name + "/pointers")) {
      this.CreatePointers();
    }
  }

  protected CreatePointers() {
    fs.mkdir(this.path + "/" + this.options.name + "/pointers", (err) => {
      if (err) return console.error(err);
    });

    //if(!fs.existsSync(this.path + "/" + this.options.databaseName + "/containers")) {
      //fs.mkdir(this.path + "/" + this.options.databaseName + "/containers", (err) => {
        //if (err) return console.error(err);
      //});
    //}
    return;
  }
  
  protected LoadPointers() {
    let pointers = fs.readdirSync(this.path + "/" + this.options.name + "/pointers");
    let pointerData: any;
    let containerData: any;
    
    for (const pointer of pointers) {
      const data = fs.readFileSync(this.path + "/" + this.options.name + `/pointers/${pointer}`);
      
      pointerData = this.ejson.deserialize(data);
    }
    let containers = fs.readdirSync(this.path + "/" + this.options.name + "/containers");
    for (const container of containers) {
      let data = fs.readFileSync(this.path + "/" + this.options.name + `/containers/${container}`);

      containerData = this.ejson.deserialize(data);
    }
    this.data.set(pointerData.key, containerData);
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
