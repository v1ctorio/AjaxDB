import { Client } from '../index';

const AjaxDB = new Client({ database: "DatabaseName", path: __dirname+"/../.." }); // Important! do not put / at the end of the path

const code = async () => {
  await AjaxDB.CreatePointer("Pointer", "Container"); 
  await AjaxDB.push("Pointer", { "content": { "name": "Nashe", "lastname": "XD" } }, true); // Use to sotre new data without affecting the others - output: boolean
  //await AjaxDB.get("Pointer", { "name": "Printf" }).then(x => console.log(x));

  AjaxDB.on("error", (error) => {
    console.error(error);
  })
};

code();

//AjaxDB.deleteByKey('Pointer', 'lastname'); // delete key - output: boolean

//console.log(AjaxDB.findPointer('Pointer')); // output: pointer data

//console.log(AjaxDB.findContainer('Pointer')); // output: container data

//console.log(AjaxDB.get("Pointer", { "name": "Printf" })); // OUTPUT: key data

//AjaxDB.size() // OUTPUT: number

//AjaxDB.edit("Pointer", { "name": "Printf" }, { "key": "lastname", "value": "XD" });

//AjaxDB.deleteSeveralByKey(["Pointer", "Pointer2"], ["Name", "Lastname"])
