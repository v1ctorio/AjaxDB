"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const fs_1 = __importDefault(require("fs"));
const Database_1 = require("./Database");
const bson_1 = __importDefault(require("bson"));
class Client extends Database_1.Database {
    constructor(options) {
        super({ name: options.name, path: options.path });
        this.shortPath = this.path + "/" + this.options.name;
        if (!fs_1.default.existsSync(this.path)) {
            throw new Error("Path is not exists");
        }
        if (!fs_1.default.existsSync(this.path + "/" + this.options.name + "/pointers")) {
            this.CreatePointers();
        }
    }
    CreatePointers() {
        fs_1.default.mkdir(this.path + "/" + this.options.name + "/pointers", (err) => {
            if (err)
                return console.error(err);
        });
        //if(!fs.existsSync(this.path + "/" + this.options.databaseName + "/containers")) {
        //fs.mkdir(this.path + "/" + this.options.databaseName + "/containers", (err) => {
        //if (err) return console.error(err);
        //});
        //}
        return;
    }
    LoadPointers() {
        let pointers = fs_1.default.readdirSync(this.path + "/" + this.options.name + "/pointers");
        let pointerData;
        let containerData;
        for (const pointer of pointers) {
            const data = fs_1.default.readFileSync(this.path + "/" + this.options.name + `/pointers/${pointer}`);
            pointerData = this.ejson.deserialize(data);
        }
        let containers = fs_1.default.readdirSync(this.path + "/" + this.options.name + "/containers");
        for (const container of containers) {
            let data = fs_1.default.readFileSync(this.path + "/" + this.options.name + `/containers/${container}`);
            containerData = this.ejson.deserialize(data);
        }
        this.data.set(pointerData.key, containerData);
    }
    CreatePointer(key, containerName) {
        if (fs_1.default.existsSync(this.shortPath + `/pointers/${key}.bson`)) {
            throw new Error("Pointer is exists");
        }
        if (fs_1.default.existsSync(this.shortPath + `/containers/${containerName}.bson`)) {
            throw new Error("Container is exists");
        }
        const pointerData = {
            "key": key,
            "container": `${containerName}`
        };
        const containerData = {
            "pointer": key,
        };
        fs_1.default.writeFileSync(this.shortPath + `/pointers/${key}.bson`, bson_1.default.serialize(pointerData));
        fs_1.default.writeFileSync(this.shortPath + `/containers/${containerName}.bson`, bson_1.default.serialize(containerData));
        return;
    }
}
exports.Client = Client;
//# sourceMappingURL=Client.js.map