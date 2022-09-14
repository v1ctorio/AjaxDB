"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const BaseClient_1 = require("./BaseClient");
const fs_1 = __importDefault(require("fs"));
const bson_1 = __importDefault(require("bson"));
class Database extends BaseClient_1.BaseClient {
    constructor(options) {
        super();
        this.options = options;
        this.name = options.name;
        this.path = this.options.path;
        if (!this.CheckContainersDir())
            this.CreateContainers();
        if (!this.CheckPointersDir())
            this.CreatePointers();
    }
    CreateDatabase() {
        if (fs_1.default.existsSync(`${this.path}/${this.name}/`)) {
            throw new Error("Path is exists");
        }
        fs_1.default.mkdir(`${this.path}/${this.name}/`, (err) => {
            console.error(err);
        });
    }
    CheckDatabaseDir() {
        if (fs_1.default.existsSync(this.path)) {
            return true;
        }
        else {
            return false;
        }
    }
    CheckPointersDir() {
        if (fs_1.default.existsSync(`${this.path}/${this.name}/pointers`)) {
            return true;
        }
        else {
            return false;
        }
    }
    CheckContainersDir() {
        if (fs_1.default.existsSync(`${this.path}/${this.name}/containers`)) {
            return true;
        }
        else {
            return false;
        }
    }
    CheckPointer(pointer) {
        if (fs_1.default.existsSync(`${this.path}/${this.name}/pointers/${pointer}.bson`)) {
            return true;
        }
        else {
            return false;
        }
    }
    CheckContainer(pointer) {
        if (this.CheckPointer(pointer)) {
            const puntero = fs_1.default.readFileSync(`${this.path}/${this.name}/pointers/${pointer}.bson`);
            const container = bson_1.default.deserialize(puntero).container;
            if (fs_1.default.existsSync(`${this.path}/${this.name}/containers/${container}.bson`)) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    CreatePointers() {
        if (!this.CheckPointersDir())
            fs_1.default.mkdir(this.path + "/" + this.name + "/pointers", (err) => {
                if (err)
                    return console.error(err);
            });
        return;
    }
    CreateContainers() {
        if (!fs_1.default.existsSync(this.path + "/" + this.name + "/containers")) {
            fs_1.default.mkdir(this.path + "/" + this.name + "/containers", (err) => {
                if (err)
                    return console.error(err);
            });
        }
        return;
    }
    writeContainer(container, value) {
        fs_1.default.writeFileSync(`${this.path}/${this.name}/containers/${container}.bson`, bson_1.default.serialize(value));
    }
    writePointer(pointer, value) {
        fs_1.default.writeFileSync(`${this.path}/${this.name}/pointers/${pointer}.bson`, bson_1.default.serialize(value));
    }
    findPointer(key) {
        if (!this.CheckDatabaseDir()) {
            this.CreateDatabase();
            console.error("Database is not exists, not find data");
            return;
        }
        if (!this.CheckPointersDir()) {
            this.CreatePointers();
            console.error("Pointers is not exists, not find data.");
            return;
        }
        if (!this.CheckContainersDir()) {
            this.CreateContainers();
            console.error("Containers is not exists, not find data.");
            return;
        }
        let data;
        if (!this.CheckPointer(key))
            throw new Error("Pointer is not exists");
        const pointersDir = fs_1.default.readdirSync(`${this.path}/${this.name}/pointers`);
        for (const pointerFile of pointersDir) {
            if (pointerFile.slice(0, -5) !== key)
                continue;
            const pointer = fs_1.default.readFileSync(`${this.path}/${this.name}/pointers/${pointerFile}`);
            data = bson_1.default.deserialize(pointer);
        }
        return data;
    }
    findContainerData(keyOfPointer) {
        if (!this.CheckDatabaseDir()) {
            this.CreateDatabase();
            console.error("Database is not exists, not find data");
            return;
        }
        if (!this.CheckPointersDir()) {
            this.CreatePointers();
            console.error("Pointers is not exists, not find data.");
            return;
        }
        if (!this.CheckContainersDir()) {
            this.CreateContainers();
            console.error("Containers is not exists, not find data.");
            return;
        }
        const key = keyOfPointer;
        let pointer = this.findPointer(key);
        if (!this.CheckContainer(key))
            throw new Error("Container is not exists");
        const container = fs_1.default.readFileSync(`${this.path}/${this.name}/containers/${pointer.container}.bson`);
        return bson_1.default.deserialize(container);
    }
    pushData(key, data) {
        const pointer = this.findPointer(key);
        let container = this.findContainerData(key);
        if (!pointer)
            throw new Error("pointer is not exists");
        if (!container)
            throw new Error("container is not exists");
        container = Object.assign(container, data);
        this.writeContainer(pointer.container, container);
        return true;
    }
    editKey(pointer, key, value) {
        const puntero = this.findPointer(pointer);
        const container = this.findContainerData(pointer);
        if (!puntero)
            throw new Error("pointer is not exists");
        if (!container)
            throw new Error("container is not exists");
        const data = Object.keys(container).find(llave => container[llave] === container[key]);
        if (!data)
            return false;
        container[key] = value;
        this.writeContainer(puntero.container, container);
        return true;
    }
    deleteKey(pointer, key) {
        const puntero = this.findPointer(pointer);
        const container = this.findContainerData(pointer);
        if (!puntero)
            throw new Error("pointer is not exists");
        if (!container)
            throw new Error("container is not exists");
        const data = Object.keys(container).find(llave => container[llave] === container[key]);
        if (!data)
            return false;
        delete container[key];
        this.writeContainer(puntero.container, container);
        return true;
    }
    getDataByKey(pointer, key) {
        const puntero = this.findPointer(pointer);
        const container = this.findContainerData(pointer);
        if (!puntero)
            throw new Error("pointer is not exists");
        if (!container)
            throw new Error("container is not exists");
        const data = Object.keys(container).find(llave => container[llave] === container[key]);
        if (!data)
            return {};
        return container[key];
    }
    set(pointer, value) {
        const puntero = this.findPointer(pointer);
        let container = this.findContainerData(pointer);
        if (!puntero)
            throw new Error("pointer is not exists");
        if (!container)
            throw new Error("container is not exists");
        container = value;
        this.writeContainer(puntero.container, container);
        return true;
    }
}
exports.Database = Database;
//# sourceMappingURL=Database.js.map