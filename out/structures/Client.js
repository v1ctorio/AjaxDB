"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const bson_1 = __importDefault(require("bson"));
const Database_1 = require("./Database");
class Client extends Database_1.Database {
    /**
      * @typedef  {Object}ClientOptions
      * @property {string} path - Path to create ajax_database folder
      * @property {string} database - Database name
      * @property {boolean} useEventErr - (Optional) Use event error or not
    */
    /**
     * @param {ClientOptions} options - Put database name and path
     */
    constructor(options) {
        super({ database: options.database, path: options.path });
        if (this.path.endsWith("/"))
            this.path = this.path.slice(0, -1);
        this.options = options;
        this.shortPath = this.path + "/ajax_databases/" + options.database;
        this.database = options.database;
        if (!node_fs_1.default.existsSync(this.path)) {
            throw new Error("Path is not exists");
        }
        this.CheckAndCreateFolders();
        this.emit('start');
    }
    async CheckAndCreateFolders() {
        if (!node_fs_1.default.existsSync(this.path + "/ajax_databases/")) {
            await node_fs_1.default.promises.mkdir(this.path + "/ajax_databases/", { recursive: true }).catch((err) => {
                if (err)
                    this.emit("error", err);
            });
        }
        if (!node_fs_1.default.existsSync(this.shortPath)) {
            await node_fs_1.default.promises.mkdir(this.shortPath, { recursive: true }).catch((e) => this.emit("error", e));
        }
        if (!node_fs_1.default.existsSync(this.path + "/ajax_databases/" + this.database + "/pointers")) {
            await this.CreatePointers();
        }
        if (!node_fs_1.default.existsSync(this.shortPath + "/containers")) {
            await this.CreateContainers();
        }
    }
    /**
     *
     * @param {string} key - Pointer name
     * @param {string} containerName - Container name
     * @returns void
     */
    async CreatePointer(key, containerName) {
        if (node_fs_1.default.existsSync(`${this.path}/ajax_databases/${this.database}/pointers/${key}.bson`))
            return;
        if (node_fs_1.default.existsSync(`${this.path}/ajax_databases/${this.database}/containers/${containerName}.bson`))
            return;
        const pointerData = bson_1.default.serialize({
            "key": key,
            "container": `${containerName}`
        });
        const containerData = bson_1.default.serialize({
            "pointer": key,
            "containers": []
        });
        await node_fs_1.default.promises
            .mkdir(`${this.path}/ajax_databases/${this.database}/pointers`, { recursive: true })
            .then(async (x) => {
            await node_fs_1.default.promises.writeFile(`${this.shortPath}/pointers/${key}.bson`, pointerData);
        })
            .catch((err) => console.error(err));
        await node_fs_1.default.promises.mkdir(`${this.path}/ajax_databases/${this.database}/containers`, { recursive: true })
            .then(async (x) => {
            await node_fs_1.default.promises.writeFile(`${this.shortPath}/containers/${containerName}.bson`, containerData);
        })
            .catch((err) => console.error(err));
    }
}
exports.Client = Client;
//# sourceMappingURL=Client.js.map