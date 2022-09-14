"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const AjaxDB = new index_1.Client({ name: "uwuDB", path: __dirname + "/../.." }); // Important! do not put / at the end of the path
AjaxDB.CreateDatabase(); // Use only if database does not exist.
AjaxDB.CreatePointer('Pointer', 'Container');
AjaxDB.pushData('Pointer', { "name": "Printf", "lastname": "Dead" }); // Use to sotre new data without affecting the others - output: boolean
AjaxDB.set('Pointer', { "name": "Aka", "lastname": "Printf" }); // Use with caution this resets the value of the entire container - output: boolean
AjaxDB.editKey('Pointer', 'name', "PrintfDead"); // Edit value of key - output: boolean
console.log(AjaxDB.getDataByKey('Pointer', 'name')); // get data by key of container - output: data of puntero
AjaxDB.deleteKey('Pointer', 'lastname'); // delete key - output: boolean
console.log(AjaxDB.findPointer('Pointer')); // output: pointer data
console.log(AjaxDB.findContainerData('Pointer')); // output: container data
//# sourceMappingURL=index.js.map