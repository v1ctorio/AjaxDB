# @AjaxDB
### [BeeDB](https://github.com/theMarzon/BeeDB) inspired package
# Information:
- :wrench: Efficient and fast database using BSON.
- :butterfly: Simple and easy to use
- :slight_smile: Version 2.0

# Installation
```sh
npm i ajax.db
```

# Examples:
- `Create Database & Start Client Instance:`
```ts
import { Client } from 'ajax.db';

const AjaxDB = new Client({ database: "DatabaseName", path: "path/to/databases" });

// Instance new Client for create new database or use a database.
```
- `CreatePointer`
```ts
AjaxDB.CreatePointer("PointerName", "ContainerName"); //It is recommended to put everything together
```
- `push`
```ts
AjaxDB.push("PointerName", { "id": number | string, "content": object }, AUTO_INCREMENT: boolean); // If AUTO_INCREMENT is true it is not necessary to declare the id, content is required 
```
- `deleteByKey`
```ts
AjaxDB.deleteByKey("PointerName", "KeyName"); //  OUTPUT: boolean
```
- `deleteSeveralByKey`
```ts
AjaxDB.deleteSeveralByKey(["Pointers"...], ["Keys"...]); // OUTPUT: boolean
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
console.log(AjaxDB.get("PointerName", { "KeyName": "KeyValue" }); // OUTPUT: key data
```
- `size`
```ts
AjaxDB.size() // OUTPUT: number
```
- `edit`
```ts
AjaxDB.edit("PointerName", { "FindKey": "ValueKey" }, { "key": "KeyName", "value": "ValueForKey" });
```

## Development notes
- The database is in the testing phase, report any errors.
- Thank you for reading!
