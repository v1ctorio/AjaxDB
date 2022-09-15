import { BaseClient } from './BaseClient';
import fs from 'fs';
import BSON from 'bson';

type options = {
  database: string;
  path: string;
}

export interface Database {
  database: string;
  options: options;
  path: string;
}

type dataPush = {
  id?: string | number;
  content: object;
}

type editKey = {
  key: string,
  value: string
}

export class Database extends BaseClient {
  constructor(options: options) {
    super();
    this.options = options;
    this.database = options.database;
    this.path = this.options.path;
    if(this.path.endsWith("/")) this.path = this.path.slice(0, -1);
  }
  
  protected CheckDatabaseDir() {
    if (fs.existsSync(this.path)) {
      return true;
    } else {
      return false;
    }
  }
  
  protected CheckPointersDir() {
    if (fs.existsSync(`${this.path}/ajax_databases/${this.database}/pointers`)) {
      return true;
    } else {
      return false;
    }
  }

  protected CheckContainersDir() {
    if (!fs.existsSync(`${this.path}/ajax_databases/${this.database}/containers`)) {
      return false;
    }
    return true;
  }

  protected CheckPointer(pointer: string) {
    if (fs.existsSync(`${this.path}/ajax_databases/${this.database}/pointers/${pointer}.bson`)) {
      return true;
    } else {
      return false;
    }
  }

  protected CheckContainer(pointer: string) {
    if(this.CheckPointer(pointer)) {
      const puntero = fs.readFileSync(`${this.path}/ajax_databases/${this.database}/pointers/${pointer}.bson`);
      const container = BSON.deserialize(puntero).container;
      if (fs.existsSync(`${this.path}/ajax_databases/${this.database}/containers/${container}.bson`)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  protected CreatePointers() {
    if (!this.CheckPointersDir()) fs.promises.mkdir(this.path + "/ajax_databases/" + this.database + "/pointers", {recursive:true}).catch((err) => { if (err) return console.error(err); });

    return;
  }

  protected CreateContainers() {
    if(!fs.existsSync(this.path + "/ajax_databases/" + this.database + "/containers")) {
      fs.promises.mkdir(`${this.path}/ajax_databases/${this.database}/containers`, {recursive: true}).catch((err) => { 
        if (err) return console.error(err);
      });
    }
    
    return;
  }

  protected writeContainer(container: string, value: object) {
    fs.writeFile(`${this.path}/ajax_databases/${this.database}/containers/${container}.bson`, BSON.serialize(value), (err)=>{ console.error(err); });
  }

  protected writePointer(pointer: string, value: object) {
    fs.writeFile(`${this.path}/ajax_databases/${this.database}/pointers/${pointer}.bson`, BSON.serialize(value), (err)=>{ console.error(err); });
  }

  public findPointer(key: string) {
    if(!this.CheckDatabaseDir()) {console.error("Database is not exists, not find data"); return;}
    if(!this.CheckPointersDir()) {this.CreatePointers(); console.error("Pointers is not exists, not find data."); return;}
    if(!this.CheckContainersDir()) {this.CreateContainers(); console.error("Containers is not exists, not find data."); return;}
    
    let data: any;
    if(!this.CheckPointer(key)) throw new Error("Pointer is not exists");
    const pointersDir = fs.readdirSync(`${this.path}/ajax_databases/${this.database}/pointers`);
    for (const pointerFile of pointersDir) {
      if(pointerFile.slice(0, -5) !== key) continue;
      const pointer = fs.readFileSync(`${this.path}/ajax_databases/${this.database}/pointers/${pointerFile}`);
      data = BSON.deserialize(pointer); 
    }
    
    return data;
  }

  public findContainer(keyOfPointer: string) {
    if(!this.CheckDatabaseDir()) {console.error("Database is not exists, not find data"); return;}
    if(!this.CheckPointersDir()) {this.CreatePointers(); console.error("Pointers is not exists, not find data."); return;}
    if(!this.CheckContainersDir()) {this.CreateContainers(); console.error("Containers is not exists, not find data."); return;}

    const key = keyOfPointer;

    let pointer = this.findPointer(key);
    if(!this.CheckContainer(key)) throw new Error("Container is not exists");
    const container = fs.readFileSync(`${this.path}/ajax_databases/${this.database}/containers/${pointer.container}.bson`);
    
    return BSON.deserialize(container); 
  }

  public push(key: string, data: dataPush, AUTO_INCREMENT?: boolean) {
    const pointer = this.findPointer(key);
    let container = this.findContainer(key);
    if(!pointer) throw new Error("pointer is not exists");
    if(!container) throw new Error("container is not exists");

    if (AUTO_INCREMENT) {
      let newContainer = {
        "id": this.sizeContainers(key)+1,
        "content": data.content
      }
      container.containers.push(newContainer);
    } else {
      if (!Object.keys(data).find((Key: any) => Key["id"])) throw new Error("Not defined \"id\" property");
      let newContainer = {
        "id": data.id,
        "content": data.content
      }
      container.containers.push(newContainer);
    }

    this.writeContainer(pointer.container, container);
    return true;
  }

  protected sizeContainers(pointer: string) {
    const container = this.findContainer(pointer);
    if(!container) throw new Error("container is not exists");
    let size = 0;  

    container.containers.forEach((x: object | any) => {
      let data = Object.keys(x).filter((key: any) => typeof key.id === "number");

      if(data) size += 1;
    });

    return size;
  }

  public deleteByKey(pointer: string, key: string) {
    const puntero = this.findPointer(pointer);
    const container = this.findContainer(pointer);
    if(!puntero) throw new Error("pointer is not exists");
    if(!container) throw new Error("container is not exists");
    
    container.containers.forEach((x: any, y: number) => {
      if(x.content[key]) delete container.containers[y].content[key]
    });
    this.writeContainer(puntero.container, container);
    return true;
  }
  public get(pointer: string, value: object) {
    let container = this.findContainer(pointer);
    let data = Object.keys(value);
    let result;
    if(!container) throw new Error("Container is not exist");
    container.containers.forEach((x: object, y: number) => {
      if(data.find((key: any) => key.id)) {
        result = data.filter((key: any) => key.id === container?.containers[y].id);
        if (!result) return null;
        return;
      }
      let content = data.find(key => container?.containers[y].content[key]);
      if(!content) return;
      let filter = data.filter(key => key === container?.containers[y].content[key]);
      result = filter;
    });
    return result;
  }

  public edit(pointer: string, findKey: object, editKey: editKey) {
    let pointerData = this.findPointer(pointer);
    let container = this.findContainer(pointer);
    if(!container) throw new Error("Container is not exists");
    if(!pointer) throw new Error("Pointer is not exist");
    let dataKey = this.get(pointer, findKey);
    
    container.containers.forEach((x: any, y: number) => {
      if(x[y].content[editKey.key]) {
        if (container != undefined) container.containers[y].content[editKey.key] = editKey.value;
      }
    });

    this.writeContainer(pointerData.container, container);
  }
 
  public size() {
    let dirs = fs.readdirSync(`${this.path}/ajax_databases/${this.database}/pointers`);
    let count = 0;

    for (const file of dirs) {
      count += 1;
    }

    return count;
  }

  public sizeContainer(pointer: string) {
    if(!this.CheckPointer(pointer)) return 0;
    let containers = fs.readdirSync(`${this.path}/ajax_databases/${this.database}/containers`);
    let size = 0;
    for (const container of containers) {
      let containerFile = fs.readFileSync(`${this.path}/ajax_databases/${this.database}/containers/${container}`);
      let data = BSON.deserialize(containerFile);
      if (data.pointer === pointer) {
        size += 1;
      }
    }
    return size;
  }

  public deleteSeveralByKey(pointers: string[], keys: string[]) {
    pointers.forEach((x: string) => {
      if(!this.CheckPointer(x)) throw new Error("Pointer is not exists");
      keys.forEach((y: string) => {
        return this.deleteByKey(x, y);
      });
    });
    return true;
  }
}
