"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class PGCarts {
    constructor(client) {
        this.client = client;
        this.tableName = 'carts';
    }
    findById(cartId) {
        return this.client.exec(`SELECT * FROM ${this.tableName} WHERE cart_id = $1 LIMIT 1;`, [cartId])
            .then(({ rows }) => rows.length ? (0, utils_1.objKeysToCamelCase)(rows[0]) : null);
    }
    findByUserId(userId, status) {
        const query = `
      SELECT * 
        FROM ${this.tableName}
        WHERE user_id = $1${status ? ` AND status = $2` : ''}
        LIMIT 1;
    `;
        const values = [userId];
        if (status) {
            values.push(status);
        }
        return this.client.exec(query, values)
            .then(({ rows }) => rows.length ? (0, utils_1.objKeysToCamelCase)(rows[0]) : null);
    }
    create(data) {
        const query = `
      INSERT INTO ${this.tableName} (user_id, status)
        VALUES ($1, $2)
        RETURNING *;
    `;
        return this.client.exec(query, [data.userId, 'OPEN'])
            .then(({ rows }) => rows[0]);
    }
    updateStatusById(cartId, status) {
        const query = `
      UPDATE ${this.tableName}
        SET status = $1
        WHERE cart_id = $2
        RETURNING *;
    `;
        return this.client.exec(query, [status, cartId])
            .then(({ rows }) => !!rows.length);
    }
    updateStatusByUserId(userId, status) {
        const query = `
      UPDATE ${this.tableName}
        SET status = $1
        WHERE user_id = $2
        RETURNING *;
    `;
        return this.client.exec(query, [status, userId])
            .then(({ rows }) => !!rows.length);
    }
    deleteById(cartId) {
        const query = `
      DELETE
        FROM ${this.tableName}
        WHERE cart_id = $1
        RETURNING *;
    `;
        return this.client.exec(query, [cartId])
            .then(({ rows }) => !!rows.length);
    }
    deleteByUserId(userId, status) {
        const query = `
      DELETE
        FROM ${this.tableName}
        WHERE user_id = $1${status ? ` AND status = $2` : ''}
        RETURNING *;
    `;
        const values = [userId];
        status && values.push(status);
        return this.client.exec(query, values)
            .then(({ rows }) => !!rows.length);
    }
}
exports.default = PGCarts;
//# sourceMappingURL=carts.js.map