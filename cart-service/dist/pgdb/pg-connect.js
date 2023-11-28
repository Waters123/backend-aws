"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresConnection = void 0;
const pg_1 = require("pg");
class PostgresConnection {
    constructor(connectionConfig) {
        this.client = new pg_1.Client(connectionConfig);
    }
    async connect() {
        await this.client.connect();
    }
    async disconnect() {
        await this.client.end();
    }
    async exec(script, values = []) {
        return this.client.query(script, values)
            .then((res) => { var _a; return ({ rows: (_a = res === null || res === void 0 ? void 0 : res.rows) !== null && _a !== void 0 ? _a : [] }); });
    }
    async transaction(callback) {
        try {
            await this.client.query('BEGIN;');
            await callback();
            await this.client.query('COMMIT;');
        }
        catch (e) {
            await this.client.query('ROLLBACK;');
            throw e;
        }
    }
}
exports.PostgresConnection = PostgresConnection;
//# sourceMappingURL=pg-connect.js.map