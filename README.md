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

const AjaxDB = new Client({ path: "path/to/databases" });
// IMPORTANT! not to put / at the end of path
AjaxDB.CreateDatabase("DatabaseName"); // Use if the database is not created - OUTPUT: boolean
```
- `SelectDatabase`
```ts
//Use if database exist
AjaxDB.SelectDatabase("DatabaseName");
```
- `CreatePointer`
```ts
AjaxDB.CreatePointer("PointerName", "ContainerName"); //It is recommended to put everything together
```
- `push`
```ts
AjaxDB.push("PointerName", { "...": ... }); // This method is used to add elements, it accepts an object with any data type as long as it follows the syntax. (IMPORTANT: the key must be defined in quotes) OUTPUT: boolean
```
- `set`
```ts
AjaxDB.set("PointerName", { "...": ... }); // Be careful, this method modifies all elements. OUTPUT: boolean
// Example of set (My Container = { "name": "Printf", "lastname": "Dead" })
AjaxDB.set("PointerName", { "name": "Printf" }); // Container = { "name": "Printf" }
```
- `editOneKey`
```ts
AjaxDB.editOneKey("PointerName", "KeyOfContainer", "value"); // edit the data of a single data OUTPUT: boolean
```
- `deleteByKey`
```ts
AjaxDB.deleteByKey("PointerName", "Key"); // delete key OUTPUT: boolean
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
- `get`
```ts
console.log(AjaxDB.get("PointerName"); // OUTPUT: key data
```
- `getSeveral`
```ts
console.log(AjaxDB.getSeveral(["Pointer1", "Pointer2", "Pointer3", ...])); // OUTPUT: object
```
- `pushSeveral`
```ts
AjaxDB.pushSeveral(["Pointer1", "Pointer2", "Pointer3"], [{...}, {...}, {...}]); // OUTPUT: boolean
```
- `size`
```ts
AjaxDB.size() // OUTPUT: number
```
- `deleteSeveralByKey`
```ts
AjaxDB.deleteSeveralByKey(["Pointer1", "Pointer2"], ["Key1", "Key2"]); // OUTPUT: boolean
```
- `editSeveral`
```ts
AjaxDB.editSeveral(["Pointers"...], ["Keys"...], ["Values"...]); // OUTPUT: boolean
```

## Development notes
- The database is in the testing phase, report any errors.
- Thank you for reading!
