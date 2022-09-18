# @AjaxDB
### [BeeDB](https://github.com/theMarzon/BeeDB) inspired package

> Documentation: [AjaxDB Docs](https://printfdead.github.io/ajaxdb/index.html)
# Information:
- :wrench: Efficient and fast database using BSON.
- :butterfly: Simple and easy to use
- :smile: Version 2.1

# Installation
```sh
npm i ajax.db --save
```

# Examples:
- `Create Database & Start Client Instance:`
```ts
import { Client } from 'ajax.db';

/**
 * @param {object} options - Put database name and path
 * @deprecated Client({ path: string});
 * @new Client({ database: string, path: string });
 * @description Instance new Client for create new database or use a database.
 */
const AjaxDB = new Client({ database: "DatabaseName", path: "path/to/databases" });

/** 
 * @param {string} event - Event name
 * @param {function} callback - Callback function
 * @description The event is emitted when the Client class is instantiated.
*/
AjaxDB.on('start', () => {
  console.log("AjaxDB start!");
});

/** 
 * @param {string} event- Event name
 * @param {function} callback - Callback error.
 * @type {error} ErrorClient interface
 * @description The event is emitted on some conditions of the Database class.
*/
AjaxDB.on('error', (error) => {
  console.error(error);  
});

// Other conditions instantiate the Error clas and stop the database
```
- `CreatePointer`
```ts

/** 
 * @param {string} pointer - pointer name
 * @param {string} container - container name
 * @async
 * @description It is recommended to put everything together
*/
await AjaxDB.CreatePointer("PointerName", "ContainerName");
```
- `push`
```ts
/** 
 * @param {string} pointer - pointer name
 * @param {object} data - data to push
 * @param {object} AUTO_INCREMENT auto increment id
 * @async
 * @description If AUTO_INCREMENT is true it is not necessary to declare the id, content is required 
*/
await AjaxDB.push("PointerName", { "id": number | string, "content": object }, AUTO_INCREMENT: boolean); 
```
- `deleteByKey`
```ts
/** 
 * @param {string} pointer - pointer name
 * @param {string} key - key name
 * @async
 * @description Deletes the data of the specified key and delete key.
*/
await AjaxDB.deleteByKey("PointerName", "KeyName"); // void
```
- `deleteSeveralByKey`
<span style="color:red">**Deprecated & Deleted method.**</span>
- `get`
```ts
/**
 * @param {string} pointer - pointer name
 * @param {object} data - find by key
 * @async
 * @description get data of the containers
 * @returns {object}
 * @output { id: number, content: object }
*/
await AjaxDB.get("PointerName", { "KeyName": "KeyValue" });
```
- `size`
```ts
/** 
 * @description number of pointers
 * @returns {number}
*/
AjaxDB.size() // OUTPUT: number
```
- `edit`
```ts
/** 
 * @param {string} pointer - pointer name
 * @param {object} findKey - key name and key value
 * @param {object} valueKey - key name and key value
 * @async
 * @description edit the data of a key - It is important that in "key" it is declared like this, do not put the name of the key that you want to edit, just leave "key"
 * @deprecated edit("Pointer", "key", value: any);
 * @new edit("Pointer", {"FindKeyName": "ValueKey"}, {"key": "KeyName", "value": "ValueForKey"});
*/

await AjaxDB.edit("PointerName", { "FindKey": "ValueKey" }, { "key": "KeyName", "value": "ValueForKey" }); // void
```
- `encrypt`
```ts
/**
 * @param {EncryptOptions} options - Options encrypt data
 * @description Encrypt string data
 * @output {key_encrypted: string, secret_key: string}
 */
const encryptData = AjaxDB.encrypt({ content: string, salt?: number });
```
- `decrypt`
```ts
/** 
 * @param {DecryptOptions} options - Options decrypt data
 * @description Decrypt string
 * @output <Crypto-JS>.lib.CipherParams
*/
const decryptedData = AjaxDB.decrypt({ encryptKey: encryptData.key_encrypted.toString(), secretKey: encryptData.secret_key});
```

## Development notes
- The database is in the testing phase, report any errors.
- Thanks you for reading!
- :star: Thanks theMarzon for the inspiration!

**[Support Discord](https://discord.gg/ZdMqhEWhUN)** | **[My Discord Profile](https://dsc.bio/printf)**
