import { BaseClient } from './BaseClient';
import fs from 'fs';
import BSON from 'bson';

type options = {
  name: string;
  path: string;
}

export interface Database {
  name: string;
  options: options;
  path: string;
}

export class Database extends BaseClient {
  constructor(options: options) {
    super();
    this.options = options;
    this.name = options.name;
    this.path = this.options.path;

    if (!this.CheckContainersDir()) this.CreateContainers();
    if (!this.CheckPointersDir()) this.CreatePointers();
  }

  public CreateDatabase() {
    if (fs.existsSync(`${this.path}/${this.name}/`)) {
      throw new Error("Path is exists");
    }

    fs.mkdir(`${this.path}/${this.name}/`, (err) => {
      console.error(err);
    });
  }
  
  protected CheckDatabaseDir() {
    if (fs.existsSync(this.path)) {
      return true;
    } else {
      return false;
    }
  }
  
  protected CheckPointersDir() {
    if (fs.existsSync(`${this.path}/${this.name}/pointers`)) {
      return true;
    } else {
      return false;
    }
  }

  protected CheckContainersDir() {
    if (fs.existsSync(`${this.path}/${this.name}/containers`)) {
      return true;
    } else {
      return false;
    }
  }

  protected CheckPointer(pointer: string) {
    if (fs.existsSync(`${this.path}/${this.name}/pointers/${pointer}.bson`)) {
      return true;
    } else {
      return false;
    }
  }

  protected CheckContainer(pointer: string) {
    if(this.CheckPointer(pointer)) {
      const puntero = fs.readFileSync(`${this.path}/${this.name}/pointers/${pointer}.bson`);
      const container = BSON.deserialize(puntero).container;
      if (fs.existsSync(`${this.path}/${this.name}/containers/${container}.bson`)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  protected CreatePointers() {
    if (!this.CheckPointersDir())
      fs.mkdir(this.path + "/" + this.name + "/pointers", (err) => {
        if (err) return console.error(err);
      });

    return;
  }

  protected CreateContainers() {
    if(!fs.existsSync(this.path + "/" + this.name + "/containers")) {
      fs.mkdir(this.path + "/" + this.name + "/containers", (err) => {
        if (err) return console.error(err);
      });
    }
    
    return;
  }

  protected writeContainer(container: string, value: object) {
    fs.writeFileSync(`${this.path}/${this.name}/containers/${container}.bson`, BSON.serialize(value));
  }

  protected writePointer(pointer: string, value: object) {
    fs.writeFileSync(`${this.path}/${this.name}/pointers/${pointer}.bson`, BSON.serialize(value));
  }

  public findPointer(key: string) {
    if(!this.CheckDatabaseDir()) {this.CreateDatabase(); console.error("Database is not exists, not find data"); return;}
    if(!this.CheckPointersDir()) {this.CreatePointers(); console.error("Pointers is not exists, not find data."); return;}
    if(!this.CheckContainersDir()) {this.CreateContainers(); console.error("Containers is not exists, not find data."); return;}
    
    let data: any;
    if(!this.CheckPointer(key)) throw new Error("Pointer is not exists");
    const pointersDir = fs.readdirSync(`${this.path}/${this.name}/pointers`);
    for (const pointerFile of pointersDir) {
      if(pointerFile.slice(0, -5) !== key) continue;
      const pointer = fs.readFileSync(`${this.path}/${this.name}/pointers/${pointerFile}`);
      data = BSON.deserialize(pointer); 
    }
    
    return data;
  }

  public findContainerData(keyOfPointer: string) {
    if(!this.CheckDatabaseDir()) {this.CreateDatabase(); console.error("Database is not exists, not find data"); return;}
    if(!this.CheckPointersDir()) {this.CreatePointers(); console.error("Pointers is not exists, not find data."); return;}
    if(!this.CheckContainersDir()) {this.CreateContainers(); console.error("Containers is not exists, not find data."); return;}

    const key = keyOfPointer;

    let pointer = this.findPointer(key);
    if(!this.CheckContainer(key)) throw new Error("Container is not exists");
    const container = fs.readFileSync(`${this.path}/${this.name}/containers/${pointer.container}.bson`);

    return BSON.deserialize(container); 
  }

  public pushData(key: string, data: object) {
    const pointer = this.findPointer(key);
    let container = this.findContainerData(key);
    if(!pointer) throw new Error("pointer is not exists");
    if(!container) throw new Error("container is not exists");
    
    container = Object.assign(container, data);
    this.writeContainer(pointer.container, container); 
    return true;
  }

  public editKey(pointer: string, key: string, value: unknown) {
    const puntero = this.findPointer(pointer);
    const container = this.findContainerData(pointer);
    if(!puntero) throw new Error("pointer is not exists");
    if(!container) throw new Error("container is not exists");
    
    const data = Object.keys(container).find(llave => container[llave] === container[key]);
    if(!data) return false;
    container[key] = value;
    this.writeContainer(puntero.container, container);
    return true;
  }

  public deleteKey(pointer: string, key: string) {
    const puntero = this.findPointer(pointer);
    const container = this.findContainerData(pointer);
    if(!puntero) throw new Error("pointer is not exists");
    if(!container) throw new Error("container is not exists");
    
    const data = Object.keys(container).find(llave => container[llave] === container[key]);
    if(!data) return false;
    delete container[key];
    this.writeContainer(puntero.container, container);
    return true;
  }

  public getDataByKey(pointer: string, key: string) {
    const puntero = this.findPointer(pointer);
    const container = this.findContainerData(pointer);
    if(!puntero) throw new Error("pointer is not exists");
    if(!container) throw new Error("container is not exists");
    
    const data = Object.keys(container).find(llave => container[llave] === container[key]);
    if(!data) return {};
    return container[key];
  }

  public set(pointer: string, value: object) {
    const puntero = this.findPointer(pointer);
    let container = this.findContainerData(pointer);
    if(!puntero) throw new Error("pointer is not exists");
    if(!container) throw new Error("container is not exists");

    container = value;
    this.writeContainer(puntero.container, container)
    return true;
  }
}
