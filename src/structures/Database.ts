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

  protected async CreatePointers() {
    if (!this.CheckPointersDir()) await fs.promises.mkdir(this.path + "/ajax_databases/" + this.database + "/pointers", {recursive:true}).catch((err) => { if (err) this.emit("error", err); });

    return;
  }

  protected async CreateContainers() {
    if(!fs.existsSync(this.path + "/ajax_databases/" + this.database + "/containers")) {
      await fs.promises.mkdir(`${this.path}/ajax_databases/${this.database}/containers`, {recursive: true}).catch((err) => { 
        if (err) this.emit("error", err);
      });
    }
    
    return;
  }

  protected writeContainer(container: string, value: object) {
    fs.writeFile(`${this.path}/ajax_databases/${this.database}/containers/${container}.bson`, BSON.serialize(value), (err)=>{ if (err) this.emit("error", err); });
  }

  protected writePointer(pointer: string, value: object) {
    fs.writeFile(`${this.path}/ajax_databases/${this.database}/pointers/${pointer}.bson`, BSON.serialize(value), (err)=>{ if (err) this.emit("error", err); });
  }

  public async findPointer(key: string) {
    if(!this.CheckDatabaseDir()) {console.error("Database is not exists, not find data"); return;}
    if(!this.CheckPointersDir()) {await this.CreatePointers(); return;}
    if(!this.CheckContainersDir()) {await this.CreateContainers(); console.error("Containers is not exists, not find data."); return;}
    
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

  public async findContainer(keyOfPointer: string) {
    if(!this.CheckDatabaseDir()) {console.error("Database is not exists, not find data"); return;}
    if(!this.CheckPointersDir()) {await this.CreatePointers(); console.error("Pointers is not exists, not find data."); return;}
    if(!this.CheckContainersDir()) {await this.CreateContainers(); console.error("Containers is not exists, not find data."); return;}

    const key = keyOfPointer;

    let pointer = await this.findPointer(key).catch((err) => console.error(err));
    if(!this.CheckContainer(key)) throw new Error("Container is not exists");
    const container = fs.readFileSync(`${this.path}/ajax_databases/${this.database}/containers/${pointer.container}.bson`);
    
    return BSON.deserialize(container); 
  }

  public async push(key: string, data: dataPush, AUTO_INCREMENT?: boolean) {
    const pointer = await this.findPointer(key).catch(err => console.error(err));
    let container = await this.findContainer(key).catch(err => console.error(err));
    if(!pointer) throw new Error("pointer is not exists");
    if(!container) throw new Error("container is not exists");
    
    let size = 0;
    await this.sizeContainers(key).then(x => {
      size = x;
    }).catch(err => console.error(err));
  
    if (AUTO_INCREMENT) {
      let newContainer = {
        "id": size+1,
        "content": data.content
      }
      container.containers.push(newContainer);
    } else {
      if (!Object.keys(data).find((Key: any) => Key === "id")) throw new Error("Not defined \"id\" property");
      let newContainer = {
        "id": data.id,
        "content": data.content
      }
      container.containers.push(newContainer);
    }

    this.writeContainer(pointer.container, container);
  }

  protected async sizeContainers(pointer: string) {
    const container = await this.findContainer(pointer).catch(err => console.error("error", err));
    if(!container) throw new Error("container is not exists");
    let size = 0;  

    container.containers.forEach(() => {
      size += 1;
    });

    return size;
  }

  public async deleteByKey(pointer: string, key: string) {
    const puntero = await this.findPointer(pointer).catch(err => console.error("error", err));
    const container = await this.findContainer(pointer).catch(err => console.error("error", err));
    if(!puntero) throw new Error("pointer is not exists");
    if(!container) throw new Error("container is not exists");
    
    container.containers.forEach((x: any, y: number) => {
      if(x.content[key]) delete container.containers[y].content[key]
    });
    this.writeContainer(puntero.container, container);
  }

  public async get(pointer: string, value: object | any) {
    let c = await this.findContainer(pointer).catch(err => console.error(err));
    let data = Object.keys(value);
    let entries = Object.entries(value);
    let result: object = {};
    if(!c) throw new Error("Container is not exist");
    
    c.containers.forEach((container: object | any) => {
      data.forEach((key: string, index: number) => {
        if (data.find(key => key === "id")) {
          if (container.id === value.id) {
            result = container;
          }
        }
        
        let keys = Object.keys(container.content);
        keys.forEach(x => {
          if (x === key) {
            if (entries[index][1] === container.content[x]) {
              result = container;
            }
          }
        });
      });
    });

    return result;
  }

  public async edit(pointer: string, findKey: object, editKey: editKey) {
    let pointerData = await this.findPointer(pointer).catch(err => console.error(err));
    let container = await this.findContainer(pointer).catch(err => console.error(err));
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
