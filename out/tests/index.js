"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const AjaxDB = new index_1.Client({ path: __dirname + "/../.." }); // Important! do not put / at the end of the path
AjaxDB.CreateDatabase("DatabaseName"); // Use only if database does not exist.
// if database exist
AjaxDB.SelectDatabase("DatabaseName");
AjaxDB.CreatePointer('Pointer', 'Container');
AjaxDB.push('Pointer', { "name": "Printf", "lastname": "Dead" }); // Use to sotre new data without affecting the others - output: boolean
AjaxDB.set('Pointer', { "name": "Aka", "lastname": "Printf" }); // Use with caution this resets the value of the entire container - output: boolean
AjaxDB.editOneKey('Pointer', 'key', "PrintfDead"); // Edit value of key - output: boolean
console.log(AjaxDB.getDataByKey('Pointer', 'key')); // get data by key of container - output: data of pointer
AjaxDB.deleteByKey('Pointer', 'lastname'); // delete key - output: boolean
console.log(AjaxDB.findPointer('Pointer')); // output: pointer data
console.log(AjaxDB.findContainer('Pointer')); // output: container data
console.log(AjaxDB.get("PointerName")); // OUTPUT: key data
console.log(AjaxDB.getSeveral(["Pointer1", "Pointer2", "Pointer3"])); // OUTPUT: object
AjaxDB.pushSeveral(["Pointer1", "Pointer2", "Pointer3"], [{}, {}, {}]); // OUTPUT: boolean
AjaxDB.size(); // OUTPUT: number
AjaxDB.deleteSeveralByKey(["Pointer1", "Pointer2"], ["Key1", "Key2"]); // OUTPUT: boolean
AjaxDB.editSeveral(["Pointer1", "Pointer2"], ["Key1", "Key2"], ["Value1", "Value2"]);
//# sourceMappingURL=index.js.map