"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseClient = void 0;
const bson_1 = require("bson");
const node_events_1 = require("node:events");
class BaseClient extends node_events_1.EventEmitter {
    constructor() {
        super();
        this.data = new Map();
        this.ejson = bson_1.EJSON;
    }
    find(key) {
    }
}
exports.BaseClient = BaseClient;
//# sourceMappingURL=BaseClient.js.map