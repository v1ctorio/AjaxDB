import { Client } from '../index';

const AjaxDB = new Client({ database: "DatabaseName", path: __dirname+"/../.." }); // Important! do not put / at the end of the path

AjaxDB.on('start', () => {
  console.log("Database connected");
});

AjaxDB.on('error', (error) => {
  console.error(error);
});

AjaxDB.CreatePointer('Pointer', 'Container');

AjaxDB.push('Pointer', { "content": { "name": "Printf", "lastname": "Dead" } }, true); // Use to sotre new data without affecting the others - output: boolean

AjaxDB.deleteByKey('Pointer', 'lastname'); // delete key - output: boolean

console.log(AjaxDB.findPointer('Pointer')); // output: pointer data

console.log(AjaxDB.findContainer('Pointer')); // output: container data

console.log(AjaxDB.get("Pointer", { "name": "Printf" })); // OUTPUT: key data

AjaxDB.size() // OUTPUT: number

AjaxDB.edit("Pointer", { "name": "Printf" }, { "key": "lastname", "value": "XD" });

AjaxDB.deleteSeveralByKey(["Pointer", "Pointer2"], ["Name", "Lastname"])
