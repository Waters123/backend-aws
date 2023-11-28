"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class PGCartItems {
    constructor(client) {
        this.client = client;
        this.tableName = 'cart_items';
    }
    findManyByCartId(cartId) {
        let query = `SELECT * FROM ${this.tableName} WHERE cart_id `;
        const values = [];
        if (Array.isArray(cartId)) {
            values.push(...cartId);
            query += `IN (${values.map((_, i) => `$${i + 1}`).join(', ')});`;
        }
        else {
            values.push(cartId);
            query += `= $1;`;
        }
        return this.client.exec(query, values)
            .then(({ rows }) => (rows || []).map((row) => (0, utils_1.objKeysToCamelCase)(row)));
    }
    createMany(cartId, data) {
        const insertItems = data.filter(({ count, productId }) => count && productId)
            .map((rec) => ([cartId, rec.productId, rec.count]));
        const insertIndexes = insertItems.map((rec, i) => rec.map((_, ii) => `$${(i * 3) + (ii + 1)}`));
        const query = `
      INSERT INTO ${this.tableName} (cart_id, product_id, count)
        VALUES (${insertIndexes.map((rec) => rec.join(', ')).join('), (')})
        RETURNING *;
    `;
        console.log(query);
        return this.client.exec(query, insertItems.flat())
            .then(({ rows }) => rows);
    }
    delete(cartId, productId) {
        const query = `
      DELETE
        FROM ${this.tableName}
        WHERE cart_id = $1${productId ? ` AND product_id = $2` : ''}
        RETURNING *;
    `;
        const values = [cartId];
        productId && values.push(productId);
        return this.client.exec(query, values)
            .then(({ rows }) => !!rows.length);
    }
}
exports.default = PGCartItems;
//# sourceMappingURL=cart-items.js.map