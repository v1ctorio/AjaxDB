"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const AjaxDB = new index_1.Client({ database: "DatabaseName", path: __dirname + "/../.." }); // Important! do not put / at the end of the path
const code = async () => {
    await AjaxDB.CreatePointer("Pointer", "Container");
    const encryptedPassword = AjaxDB.encrypt({ content: "XD" });
    await AjaxDB.push("Pointer", { "content": { "name": "Nashe", "password": encryptedPassword.key_encrypt.toString() } }, true); // Use to sotre new data without affecting the others - output: boolean
    const decryptedPassword = AjaxDB.decrypt({ encryptKey: encryptedPassword.key_encrypt, secretKey: encryptedPassword.secret_key });
    console.log(decryptedPassword);
    //await AjaxDB.get("Pointer", { "name": "Nashe" }).then(x => console.log(x));
    //await AjaxDB.deleteByKey("Pointer", "lastname");
    AjaxDB.on("error", (error) => {
        console.error(error);
    });
};
code();
//AjaxDB.deleteByKey('Pointer', 'lastname'); // delete key - output: boolean
//console.log(AjaxDB.findPointer('Pointer')); // output: pointer data
//console.log(AjaxDB.findContainer('Pointer')); // output: container data
//console.log(AjaxDB.get("Pointer", { "name": "Printf" })); // OUTPUT: key data
//AjaxDB.size() // OUTPUT: number
//AjaxDB.edit("Pointer", { "name": "Printf" }, { "key": "lastname", "value": "XD" });
//AjaxDB.deleteSeveralByKey(["Pointer", "Pointer2"], ["Name", "Lastname"])
//# sourceMappingURL=index.js.map