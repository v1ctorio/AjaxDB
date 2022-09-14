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
    if(this.path.endsWith("/")) this.path = this.path.slice(0, -1);

    if (!this.CheckContainersDir()) this.CreateContainers();
    if (!this.CheckPointersDir()) this.CreatePointers();
  }

  public CreateDatabase() {
    if (fs.existsSync(`${this.path}/ajax_databases/${this.name}/`)) {
      throw new Error("Path is exists");
    }

    fs.mkdir(`${this.path}/ajax_databases/${this.name}/`, (err) => {
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
    if (fs.existsSync(`${this.path}/ajax_databases/${this.name}/pointers`)) {
      return true;
    } else {
      return false;
    }
  }

  protected CheckContainersDir() {
    if (fs.existsSync(`${this.path}/ajax_databases/${this.name}/containers`)) {
      return true;
    } else {
      return false;
    }
  }

  protected CheckPointer(pointer: string) {
    if (fs.existsSync(`${this.path}/ajax_databases/${this.name}/pointers/${pointer}.bson`)) {
      return true;
    } else {
      return false;
    }
  }

  protected CheckContainer(pointer: string) {
    if(this.CheckPointer(pointer)) {
      const puntero = fs.readFileSync(`${this.path}/ajax_databases/${this.name}/pointers/${pointer}.bson`);
      const container = BSON.deserialize(puntero).container;
      if (fs.existsSync(`${this.path}/ajax_databases/${this.name}/containers/${container}.bson`)) {
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
      fs.mkdir(this.path + "/ajax_databases/" + this.name + "/pointers", (err) => {
        if (err) return console.error(err);
      });

    return;
  }

  protected CreateContainers() {
    if(!fs.existsSync(this.path + "/ajax_databases/" + this.name + "/containers")) {
      fs.mkdir(this.path + "/" + this.name + "/containers", (err) => {
        if (err) return console.error(err);
      });
    }
    
    return;
  }

  protected writeContainer(container: string, value: object) {
    fs.writeFileSync(`${this.path}/ajax_databases/${this.name}/containers/${container}.bson`, BSON.serialize(value));
  }

  protected writePointer(pointer: string, value: object) {
    fs.writeFileSync(`${this.path}/ajax_databases/${this.name}/pointers/${pointer}.bson`, BSON.serialize(value));
  }

  public findPointer(key: string) {
    if(!this.CheckDatabaseDir()) {this.CreateDatabase(); console.error("Database is not exists, not find data"); return;}
    if(!this.CheckPointersDir()) {this.CreatePointers(); console.error("Pointers is not exists, not find data."); return;}
    if(!this.CheckContainersDir()) {this.CreateContainers(); console.error("Containers is not exists, not find data."); return;}
    
    let data: any;
    if(!this.CheckPointer(key)) throw new Error("Pointer is not exists");
    const pointersDir = fs.readdirSync(`${this.path}/ajax_databases/${this.name}/pointers`);
    for (const pointerFile of pointersDir) {
      if(pointerFile.slice(0, -5) !== key) continue;
      const pointer = fs.readFileSync(`${this.path}/ajax_databases/${this.name}/pointers/${pointerFile}`);
      data = BSON.deserialize(pointer); 
    }
    
    return data;
  }

  public findContainer(keyOfPointer: string) {
    if(!this.CheckDatabaseDir()) {this.CreateDatabase(); console.error("Database is not exists, not find data"); return;}
    if(!this.CheckPointersDir()) {this.CreatePointers(); console.error("Pointers is not exists, not find data."); return;}
    if(!this.CheckContainersDir()) {this.CreateContainers(); console.error("Containers is not exists, not find data."); return;}

    const key = keyOfPointer;

    let pointer = this.findPointer(key);
    if(!this.CheckContainer(key)) throw new Error("Container is not exists");
    const container = fs.readFileSync(`${this.path}/ajax_databases/${this.name}/containers/${pointer.container}.bson`);

    return BSON.deserialize(container); 
  }

  public push(key: string, data: object) {
    const pointer = this.findPointer(key);
    let container = this.findContainer(key);
    if(!pointer) throw new Error("pointer is not exists");
    if(!container) throw new Error("container is not exists");
    
    container = Object.assign(container, data);
    this.writeContainer(pointer.container, container); 
    return true;
  }

  public editByKey(pointer: string, key: string, value: unknown) {
    const puntero = this.findPointer(pointer);
    const container = this.findContainer(pointer);
    if(!puntero) throw new Error("pointer is not exists");
    if(!container) throw new Error("container is not exists");
    
    const data = Object.keys(container).find(llave => container[llave] === container[key]);
    if(!data) return false;
    container[key] = value;
    this.writeContainer(puntero.container, container);
    return true;
  }

  public deleteByKey(pointer: string, key: string) {
    const puntero = this.findPointer(pointer);
    const container = this.findContainer(pointer);
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
    const container = this.findContainer(pointer);
    if(!puntero) throw new Error("pointer is not exists");
    if(!container) throw new Error("container is not exists");
    
    const data = Object.keys(container).find(llave => container[llave] === container[key]);
    if(!data) return {};
    return container[key];
  }

  public set(pointer: string, value: object) {
    const puntero = this.findPointer(pointer);
    let container = this.findContainer(pointer);
    if(!puntero) throw new Error("pointer is not exists");
    if(!container) throw new Error("container is not exists");

    container = Object.assign({ "pointer": pointer }, value);
    this.writeContainer(puntero.container, container);
    return true;
  }

  public get(pointer: string) {
    return this.findContainer(pointer);
  }

  public getSeveral(pointers: string[]) {
    let data: object = {};
    pointers.forEach((x: string) => {
      let container = this.findContainer(x);
      Object.assign(data, container);
    });
    return data;
  }

  public pushSeveral(pointers: string[], obj: object[]) {
    try{
      pointers.forEach((x: string) => {
        obj.forEach((y: object) => {
          this.push(x, y);
        });
      });
    } catch (e) {console.error(e); return false;}
    return true;
  }

  public size() {
    let dirs = fs.readdirSync(`${this.path}/ajax_databases/${this.name}/pointers`);
    let count = 0;

    for (const file of dirs) {
      count += 1;
    }

    return count;
  }

  public deleteSeveralByKey(pointers: string[], keys: string[]) {
    pointers.forEach((x: string) => {
      keys.forEach((y: string) => {
        this.deleteByKey(x, y);
      });
    });
    return true;
  }
}
