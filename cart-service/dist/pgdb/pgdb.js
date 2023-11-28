"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PGDB = void 0;
const carts_1 = __importDefault(require("./carts/carts"));
const cart_items_1 = __importDefault(require("./cart-items/cart-items"));
class PGDB {
    constructor(_client) {
        this._client = _client;
    }
    static init(client) {
        PGDB._instance = new PGDB(client);
    }
    static get db() {
        if (!PGDB._instance) {
            throw new Error('PGDB is not initialized.');
        }
        return PGDB._instance;
    }
    get carts() {
        if (!this._carts) {
            this._carts = new carts_1.default(this._client);
        }
        return this._carts;
    }
    transactionQuery(callback) {
        return this._client.transaction(callback);
    }
    get cartItems() {
        if (!this._cartItems) {
            this._cartItems = new cart_items_1.default(this._client);
        }
        return this._cartItems;
    }
}
exports.PGDB = PGDB;
//# sourceMappingURL=pgdb.js.map