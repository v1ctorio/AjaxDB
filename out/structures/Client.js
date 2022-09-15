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
        super({ database: options.database, path: options.path });
        if (this.path.endsWith("/"))
            this.path = this.path.slice(0, -1);
        this.shortPath = this.path + "/ajax_databases/" + options.database;
        this.database = options.database;
        if (!fs_1.default.existsSync(this.path)) {
            throw new Error("Path is not exists");
        }
        if (!fs_1.default.existsSync(this.path + "/ajax_databases/")) {
            fs_1.default.mkdir(this.path + "/ajax_databases/", (err) => {
                if (err)
                    return console.log(err);
            });
        }
        if (!fs_1.default.existsSync(this.shortPath)) {
            fs_1.default.mkdir(this.shortPath, (err) => {
                if (err)
                    return console.error(err);
            });
        }
        if (!fs_1.default.existsSync(this.path + "/ajax_databases/" + this.database + "/pointers")) {
            this.CreatePointers();
        }
    }
    CreatePointer(key, containerName) {
        if (!this.CheckContainersDir())
            this.CreateContainers();
        if (!this.CheckPointersDir())
            this.CreatePointers();
        if (fs_1.default.existsSync(`${this.path}/ajax_databases/${this.database}/pointers/${key}.bson`))
            console.error("Pointer is exist");
        if (fs_1.default.existsSync(`${this.path}/ajax_databases/${this.database}/containers/${containerName}.bson`))
            throw new Error("Container is exist");
        const pointerData = {
            "key": key,
            "container": `${containerName}`
        };
        const containerData = {
            "pointer": key,
        };
        fs_1.default.writeFileSync(`${this.path}/ajax_databases/${this.database}/pointers/${key}.bson`, bson_1.default.serialize(pointerData));
        fs_1.default.writeFileSync(`${this.path}/ajax_databases/${this.database}/containers/${containerName}.bson`, bson_1.default.serialize(containerData));
        return;
    }
}
exports.Client = Client;
//# sourceMappingURL=Client.js.map