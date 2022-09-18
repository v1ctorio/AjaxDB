import fs from 'node:fs';

import BSON, { Document } from 'bson';

import { BaseClient } from './BaseClient';

import crypto from 'crypto-js';
import bcrypt from 'bcryptjs';

/**
 * @typedef DatabaseOptions
 * @type {object}
 * @property {string} database - Database name
 * @property {string} path - Path to create ajax_databases folder
 */
type options = {

  database: string
  path:     string
};

export interface Database {

  database: string
  path:     string

  options: options
}

/**
 * @typedef PushOptions
 * @type {object}
 * @property {object} content - Content data to push
 * @property {string, number}  id? - ID container (Optional)
 */
type dataPush = {

  content: object

  id?: string | number
};

/**
 * @typedef FindOptions
 * @type {object}
 * @property {string} keyName - Key to find
 * @property {string} keyValue - Value to find
 */
type findOptions = {
  id?: string | number,
  keyName?: string,
  keyValue: string
}

/**
 * @typedef EditKeyOptions
 * @type {object}
 * @property {string} key - Key to edit
 * @property {string} value - Value to edit
 */
type editKey = {

  key:   string
  value: string
};

/**
 * @typedef editOptions
 * @type {object}
 * @property {FindOptions}  find - Find options
 * @property {EditKeyOptions} edit - Edit key options
 */
type editOptions = {
  find: findOptions,
  edit: editKey
}

/**
 * @typedef EncryptedOptions
 * @type {object}
 * @property {string} content - Content to be encrypted
 * @property {number} salt - Length salt
 */
type encriptOptions = {

  content: string,

  salt?: number | 10
}

type CipherParams = typeof crypto.lib.CipherParams;

/**
 * @typedef DecryptedOptions
 * @type {object}
 * @property {CipherParams} encryptKey - Encrypted key string generate by encrypt method
 * @property {string} secretKey - Secret key generate by encrypt method
 */
type decryptOptions = {

  encryptKey: crypto.lib.CipherParams,
  
  secretKey: string
}



export class Database extends BaseClient {

  /**
   * @constructor
   * @param {DatabaseOptions} options - Put database name and path
   */
  constructor(options: options) {

    super();

    this.options  = options;
    this.database = options.database;
    this.path     = this.options.path;

    if (this.path.endsWith("/")) this.path = this.path.slice(0, -1);
  }
  
  /**
   * @protected
   * @description Check if the "ajax_databases" directory exists
   * @returns boolean
   */
  protected CheckDatabaseDir() {

    return fs.existsSync(this.path);
  }
  
  /**
   * @protected
   * @description Check if the "pointers" directory exists
   * @returns boolean
   */
  protected CheckPointersDir() {

   return fs.existsSync(`${this.path}/ajax_databases/${this.database}/pointers`); 
  }

  /**
   * @protected
   * @description Check if the "containers" directory exists
   * @returns boolean
   */
  protected CheckContainersDir() {

    return fs.existsSync(`${this.path}/ajax_databases/${this.database}/containers`);
  }

  /**
   * @protected
   * @description Check if the pointer file exists
   * @param {string} pointer - Pointer name 
   * @returns boolean
   */
  protected CheckPointer(pointer: string) {

    return fs.existsSync(`${this.path}/ajax_databases/${this.database}/pointers/${pointer}.bson`);
  }

  /**
   * @protected
   * @description Check if the container file exists
   * @param {string} pointer - Pointer name
   * @returns boolean
   */
  protected CheckContainer(pointer: string) {

    if(!this.CheckPointer(pointer)) return false;

    const puntero = fs.readFileSync(`${this.path}/ajax_databases/${this.database}/pointers/${pointer}.bson`);

    const container = BSON.deserialize(puntero).container;
    
    return fs.existsSync(`${this.path}/ajax_databases/${this.database}/containers/${container}.bson`);
  }

  /**
   * @protected
   * @async
   * @description Create pointers folder
   * @returns void
   */
  protected async CreatePointers() {
    if (this.CheckPointersDir()) return;
 
    await fs.promises
      .mkdir(this.path + "/ajax_databases/" + this.database + "/pointers", { recursive: true })
      .catch((err) => { 

      if (err) this.emit("error", err); 
    });
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
      if ( pointerFile !== key+".bson" ) continue;

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
   * @param {PushOptions} data - Data to be pushed
   * @param AUTO_INCREMENT 
   */
  public async push(key: string, data: dataPush, AUTO_INCREMENT?: boolean) {
    const pointer = await this.findPointer(key).catch(err => console.error(err));

    const container = await this.findContainer(key).catch(err => console.error(err));

    if ( !pointer )
     throw new Error("pointer is not exists");

    if ( !container ) 
      throw new Error("container is not exists");
    
    let size = 0;
    let newContainer: object = {};

    await this.sizeContainers(key)
      .then(x => {
      size = x;
      })
      .catch(err => console.error(err));

    if ( AUTO_INCREMENT ) {
      newContainer = {
        "id": size+1,
        "content": data.content
      }

    } else {
      if ( !Object.keys(data).find((Key: string) => Key === "id") ) 
        throw new Error("Not defined \"id\" property");

      newContainer = {
        "id": data.id,
        "content": data.content
      }
    }

    container.containers.push(newContainer);

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
   * @deprecated
   * @description Delete multiple keys together
   */
  public async deleteSeveralByKey(pointers: string[], keys: string[]) {
    console.log("[!] Method id deprecated."); 
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
   * @param {FindOptions} find - Data to be find for in the container
   * @returns object
   */
  public async get(pointer: string, find: findOptions) {
    const c = await this.findContainer(pointer).catch(err => console.error(err));
    const data = Object.keys(find);
    const entries = Object.entries(find);
    let result: object = {};

    if ( !c ) 
      throw new Error("Container is not exist");
    
    c.containers.forEach((container: object | any) => {
      data.forEach((key: string, index: number) => {
        if ( data.find(key => key === "id") ) {

          if ( container.id === find.id )
            result = container;
          
        }
        
        const keys = Object.keys(container.content);

        keys.forEach(x => {
          if ( x === key ) {

            if ( entries[index][1] === container.content[x] )
              result = container;

          }
        });
      });
    });
    
    if ( Object.entries(result).length === 0 )
      return null;

    return result;
  }

  /**
   * @public
   * @async
   * @description Edit data container
   * @param {string} pointer - Pointer name 
   * @param {EditOptions} editOptions - Edit options 
   */
  public async edit(pointer: string, editOptions: editOptions) {
    const pointerData: any = await this.findPointer(pointer).catch(err => console.error(err));
    const container: any = await this.findContainer(pointer).catch(err => console.error(err));

    if ( !container ) 
      throw new Error("Container is not exists");

    if ( !pointerData ) 
      throw new Error("Pointer is not exist");

    const findKey = editOptions.find;
    const editKey = editOptions.edit;
    
    await this.get(pointer, findKey).then((data: any) => {
      if (!data) 
        throw new Error("Container is not exists");

      if (!Object.keys(editKey).find(key => key === "key")) 
        throw new Error("key is not defined");

      if (!Object.keys(editKey).find(key => key === "value")) 
        throw new Error("key is not defined");

      container?.containers.forEach((x: any, y: number) => {
        if(x.id === data.id) {
          if(x.content[editKey.key]) {
            data.content[editKey.key] = editKey.value;
            container.containers[y] = data;
          }
        }       
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
    const dirs = fs.readdirSync(`${this.path}/ajax_databases/${this.database}/pointers`);
    let count = 0;

    for (const file of dirs) {
      count += 1;
    }

    return count;
  }

  /**
   * @protected
   * @description Count the containers in containers folder
   * @param {string} pointer - Pointer name 
   * @returns number
   */
  protected sizeContainer(pointer: string) {
    if ( !this.CheckPointer(pointer) ) 
      return;

    const containers = fs.readdirSync(`${this.path}/ajax_databases/${this.database}/containers`);

    let size = 0;

    for (const container of containers) {
      const containerFile = fs.readFileSync(`${this.path}/ajax_databases/${this.database}/containers/${container}`);

      const data = BSON.deserialize(containerFile);

      if (data.pointer === pointer) 
        size += 1;
    }
    return size;

  }

  /**
   * @public
   * @description Encrypted string
   * @param {EncryptedOptions} options - Encrypted Options
   * @returns object
   */
  public encrypt(options: encriptOptions) {
    const salt = bcrypt.genSaltSync(options.salt);
    const hash = bcrypt.hashSync(options.content, salt);
    const encryptKey = crypto.AES.encrypt(options.content, hash); 

    return { key_encrypt: encryptKey, secret_key: hash };
  }

  /**
   * @public
   * @description Decrypted string
   * @param {DecryptedOptions} options - Descrypted options 
   * @returns string
   */
  public decrypt(options: decryptOptions) {
    const bytes = crypto.AES.decrypt(options.encryptKey, options.secretKey);
    const decryptedData = bytes.toString(crypto.enc.Utf8);

    return decryptedData;
  }
}
