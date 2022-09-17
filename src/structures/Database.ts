import { BaseClient } from './BaseClient';
import fs from 'fs';
import BSON, { Document } from 'bson';

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
  /**
   * @constructor
   * @param {object} options - Put database name and path
   */
  constructor(options: options) {
    super();
    this.options = options;
    this.database = options.database;
    this.path = this.options.path;
    if ( this.path.endsWith("/") ) 
      this.path = this.path.slice(0, -1);
  }
  
  /**
   * @protected
   * @description Check if the "ajax_databases" directory exists
   * @returns boolean
   */
  protected CheckDatabaseDir() {
    if ( fs.existsSync(this.path) ) 
      return true;
    else 
      return false;
  }
  
  /**
   * @protected
   * @description Check if the "pointers" directory exists
   * @returns boolean
   */
  protected CheckPointersDir() {
    if ( fs.existsSync(`${this.path}/ajax_databases/${this.database}/pointers`) ) 
      return true;
    else 
      return false;
    
  }

  /**
   * @protected
   * @description Check if the "containers" directory exists
   * @returns boolean
   */
  protected CheckContainersDir() {
    if ( !fs.existsSync(`${this.path}/ajax_databases/${this.database}/containers`) )
      return false;
    else
      return true;
  }

  /**
   * @protected
   * @description Check if the pointer file exists
   * @param {string} pointer - Pointer name 
   * @returns boolean
   */
  protected CheckPointer(pointer: string) {
    if ( fs.existsSync(`${this.path}/ajax_databases/${this.database}/pointers/${pointer}.bson`) )
      return true;
    else
      return false;
  }

  /**
   * @protected
   * @description Check if the container file exists
   * @param {string} pointer - Pointer name
   * @returns boolean
   */
  protected CheckContainer(pointer: string) {
    if( this.CheckPointer(pointer) ) {
      const puntero = fs.readFileSync(`${this.path}/ajax_databases/${this.database}/pointers/${pointer}.bson`);
      const container = BSON.deserialize(puntero).container;
      if ( fs.existsSync(`${this.path}/ajax_databases/${this.database}/containers/${container}.bson`) ) 
        return true;
      else 
        return false;
    } else {
      return false;
    }
  }

  /**
   * @protected
   * @async
   * @description Create pointers folder
   * @returns void
   */
  protected async CreatePointers() {
    if ( !this.CheckPointersDir() ) 
      await fs.promises.mkdir(this.path + "/ajax_databases/" + this.database + "/pointers", {recursive:true}).catch((err) => { 
        if (err) this.emit("error", err); 
      });

    return;
  }

  /**
   * @protected
   * @async
   * @description Create containers folder
   * @returns void
   */
  protected async CreateContainers() {
    if ( !fs.existsSync(this.path + "/ajax_databases/" + this.database + "/containers") ) {
      await fs.promises.mkdir(`${this.path}/ajax_databases/${this.database}/containers`, {recursive: true}).catch((err) => { 
        if (err) this.emit("error", err);
      });
    }
    
    return;
  }

  /**
   * @protected
   * @description Write container file
   * @param {string} container - container name
   * @param {object} value - Container new data
   */
  protected writeContainer(container: string, value: object) {
    fs.writeFile(`${this.path}/ajax_databases/${this.database}/containers/${container}.bson`, BSON.serialize(value), (err) => { 
      if (err) this.emit("error", err); 
    });
  }

  /**
   * @protected
   * @description write container pointer
   * @param {string} pointer - Pointer name 
   * @param {object} value  - Pointer new data
   */
  protected writePointer(pointer: string, value: object) {
    fs.writeFile(`${this.path}/ajax_databases/${this.database}/pointers/${pointer}.bson`, BSON.serialize(value), (err) => { 
      if (err) this.emit("error", err); 
    });
  }

  /**
   * @protected
   * @async
   * @description Find pointer information
   * @param {string} key - Key to find pointer information
   * @returns object
   */
  protected async findPointer(key: string) {
    if ( !this.CheckDatabaseDir() ) 
      throw new Error("Database is not exists, not find data"); 

    if ( !this.CheckPointersDir() ) 
      await this.CreatePointers(); 

    if ( !this.CheckContainersDir() ) 
      await this.CreateContainers();
    
    let data: Document = {};
    if ( !this.CheckPointer(key) ) 
      throw new Error("Pointer is not exists");

    const pointersDir = fs.readdirSync(`${this.path}/ajax_databases/${this.database}/pointers`);

    for (const pointerFile of pointersDir) {
      if ( pointerFile.slice(-5) !== key ) continue;

      const pointer = fs.readFileSync(`${this.path}/ajax_databases/${this.database}/pointers/${pointerFile}`);

      data = BSON.deserialize(pointer); 
    }
    
    return data;
  }

  /**
   * @protected
   * @async
   * @description Find container information
   * @param {string} keyOfPointer - Pointer name 
   * @returns object
   */
  protected async findContainer(keyOfPointer: string) {
    if ( !this.CheckDatabaseDir() ) { 
      console.error("Database is not exists, not find data"); 
      return; 
    }

    if ( !this.CheckPointersDir() ) {
      await this.CreatePointers(); 
      console.error("Pointers is not exists, not find data."); 
      return;
    }

    if ( !this.CheckContainersDir() ) {
      await this.CreateContainers(); 
      console.error("Containers is not exists, not find data."); 
      return;
    }

    const key = keyOfPointer;

    const pointer = await this.findPointer(key).catch((err) => console.error(err));

    if ( !pointer ) 
      throw new Error("pointer is not exists");

    if ( !this.CheckContainer(key) ) 
      throw new Error("Container is not exists");

    const container = fs.readFileSync(`${this.path}/ajax_databases/${this.database}/containers/${pointer.container}.bson`);
    
    return BSON.deserialize(container); 
  }

  /**
   * @public
   * @async
   * @description Push the data to the container
   * @param {string} key - Pointer name 
   * @param {object} data - Data to be pushed
   * @param AUTO_INCREMENT 
   */
  public async push(key: string, data: dataPush, AUTO_INCREMENT?: boolean) {
    const pointer = await this.findPointer(key).catch(err => console.error(err));

    let container = await this.findContainer(key).catch(err => console.error(err));

    if ( !pointer )
     throw new Error("pointer is not exists");

    if(!container) 
      throw new Error("container is not exists");
    
    let size = 0;

    await this.sizeContainers(key)
      .then(x => {
      size = x;
      })
      .catch(err => console.error(err));
  
    if ( AUTO_INCREMENT ) {
      let newContainer = {
        "id": size+1,
        "content": data.content
      }

      container.containers.push(newContainer);
    } else {
      if ( !Object.keys(data).find((Key: string) => Key === "id") ) 
        throw new Error("Not defined \"id\" property");

      let newContainer = {
        "id": data.id,
        "content": data.content
      }

      container.containers.push(newContainer);
    }

    this.writeContainer(pointer.container, container);
  }

  /**
   * @protected
   * @async
   * @description Count the containers
   * @param {string} pointer - Pointer name 
   * @returns number
   */
  protected async sizeContainers(pointer: string) {
    const container = await this.findContainer(pointer).catch(err => console.error("error", err));

    if ( !container ) 
      throw new Error("container is not exists");
    let size = 0;  

    container.containers.forEach(() => {
      size += 1;
    });

    return size;
  }
  
  /**
   * @public 
   * @async
   * @description Delete multiple keys together
   * @param {array} pointers - Pointers name 
   * @param {array} keys  - Keys name
   */
  public async deleteSeveralByKey(pointers: string[], keys: string[]) {
    pointers.forEach((x: string) => {
      if ( !this.CheckPointer(x) ) 
        throw new Error("Pointer is not exists");

      keys.forEach(async (y: string) => {
        await this.deleteByKey(x, y).catch(err => console.error(err));
      });
    });
  }

  /**
   * @public
   * @async
   * @description Delete keys
   * @param {string} pointer - Pointer name
   * @param {string} key - Key name
   */
  public async deleteByKey(pointer: string, key: string) {
    const puntero = await this.findPointer(pointer).catch(err => console.error("error", err));
    const container = await this.findContainer(pointer).catch(err => console.error("error", err));
    if ( !puntero ) 
      throw new Error("pointer is not exists");
    
    if ( !container ) 
      throw new Error("container is not exists");
    
    container.containers.forEach((x: any, y: number) => {
      if(x.content[key]) 
        delete container.containers[y].content[key]
    });

    this.writeContainer(puntero.container, container);
  }

  /**
   * @public
   * @async
   * @description Get container data
   * @param {string} pointer - Pointer name
   * @param {object} value - Data to be find for in the container
   * @returns object
   */
  public async get(pointer: string, value: object | any) {
    let c = await this.findContainer(pointer).catch(err => console.error(err));
    let data = Object.keys(value);
    let entries = Object.entries(value);
    let result: object = {};

    if ( !c ) 
      throw new Error("Container is not exist");
    
    c.containers.forEach((container: object | any) => {
      data.forEach((key: string, index: number) => {
        if ( data.find(key => key === "id") ) {

          if ( container.id === value.id )
            result = container;
          
        }
        
        let keys = Object.keys(container.content);

        keys.forEach(x => {
          if ( x === key ) {

            if ( entries[index][1] === container.content[x] )
              result = container;

          }
        });
      });
    });

    return result;
  }

  /**
   * @public
   * @async
   * @description Edit data container
   * @param {string} pointer - Pointer name 
   * @param {object} findKey - Find key data 
   * @param {object} editKey - Edit key data
   */
  public async edit(pointer: string, findKey: object, editKey: editKey) {
    let pointerData: any = await this.findPointer(pointer).catch(err => console.error(err));
    let container: any = await this.findContainer(pointer).catch(err => console.error(err));

    if ( !container ) 
      throw new Error("Container is not exists");

    if ( !pointerData ) 
      throw new Error("Pointer is not exist");
    
    await this.get(pointer, findKey).then((data: any) => {
      if (!data) 
        throw new Error("Container is not exists");

      if (!Object.keys(editKey).find(key => key === "key")) 
        throw new Error("key is not defined");

      if (!Object.keys(editKey).find(key => key === "value")) 
        throw new Error("key is not defined");

      container?.containers.forEach((x: any, y: number) => {
        if(x[y].content[editKey.key])
          if (container != undefined) data.content[editKey.key] = editKey.value;
      });

      this.writeContainer(pointerData.container, container);

    }).catch(err => console.error(err));
  }
 
  /**
   * @public
   * @description Count the pointers
   * @returns number
   */
  public size() {
    let dirs = fs.readdirSync(`${this.path}/ajax_databases/${this.database}/pointers`);
    let count = 0;

    for (const file of dirs) {
      count += 1;
    }

    return count;
  }

  /**
   * @public
   * @description Count the containers in containers folder
   * @param {string} pointer - Pointer name 
   * @returns number
   */
  public sizeContainer(pointer: string) {
    if ( !this.CheckPointer(pointer) ) 
      return;

    let containers = fs.readdirSync(`${this.path}/ajax_databases/${this.database}/containers`);

    let size = 0;

    for (const container of containers) {
      let containerFile = fs.readFileSync(`${this.path}/ajax_databases/${this.database}/containers/${container}`);

      let data = BSON.deserialize(containerFile);

      if (data.pointer === pointer) 
        size += 1;
    }
    return size;
  } 
}
