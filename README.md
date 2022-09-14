# @AjaxDB
### [BeeDB](https://github.com/theMarzon/BeeDB) inspired package
# Information:
- :wrench: Efficient and fast database using BSON.
- :butterfly: Simple and easy to use

# Installation
```sh
npm i ajax.db
```

# Examples:
- `Create Database & Start Client Instance:`
```ts
import { Client } from 'ajax.db';

const AjaxDB = new Client({ name: "Database name (It is recommended to put everything together)", path: "path/to/databases" });
// IMPORTANT! not to put / at the end of path
AjaxDB.CreateDatabase(); // Use if the database is not created - OUTPUT: boolean
```
- `CreatePointer`
```ts
AjaxDB.CreatePointer("PointerName", "ContainerName"); //It is recommended to put everything together
```
- `pushData`
```ts
AjaxDB.pushData("PointerName", { "...": ... }); // This method is used to add elements, it accepts an object with any data type as long as it follows the syntax. (IMPORTANT: the key must be defined in quotes) OUTPUT: boolean
```
- `set`
```ts
AjaxDB.set("PointerName", { "...": ... }); // Be careful, this method modifies all elements. OUTPUT: boolean
// Example of set (My Container = { "name": "Printf", "lastname": "Dead" })
AjaxDB.set("PointerName", { "name": "Printf" }); // Container = { "name": "Printf" }
```
- `editKey`
```ts
AjaxDB.editKey("PointerName", "KeyOfContainer", "value"); // edit the data of a single data OUTPUT: boolean
```
- `deleteKey`
```ts
AjaxDB.deleteKey("PointerName", "Key"); // delete key OUTPUT: boolean
```
- `getDataByKey`
```ts
console.log(AjaxDB.getDataByKey("PointerName", "key")); // OUTPUT: key data
```
- `findPointer`
```ts
console.log(AjaxDB.findPointer("PointerName")); // OUTPUT: Pointer data
```
- `findContainer`
```ts
console.log(AjaxDB.findContainer("PointerName")); // OUTPUT: Container data
```

## Development notes
- The database is in the testing phase, report any errors.
- Thank you for reading!
