"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const pgdb_1 = require("../../pgdb");
const model_1 = require("../../pgdb/carts/model");
let CartService = class CartService {
    async findByUserId(userId) {
        const cart = await pgdb_1.PGDB.db.carts.findByUserId(userId, model_1.CartStatus.Open);
        if (!cart)
            return null;
        return {
            ...cart,
            items: await pgdb_1.PGDB.db.cartItems.findManyByCartId(cart.cartId)
        };
    }
    createByUserId(userId) {
        return pgdb_1.PGDB.db.carts.create({ userId });
    }
    async findOrCreateByUserId(userId) {
        let userCart = await pgdb_1.PGDB.db.carts.findByUserId(userId, model_1.CartStatus.Open);
        const items = (userCart === null || userCart === void 0 ? void 0 : userCart.cartId) ? await pgdb_1.PGDB.db.cartItems.findManyByCartId(userCart.cartId) : [];
        userCart !== null && userCart !== void 0 ? userCart : (userCart = await this.createByUserId(userId));
        const { cartId } = userCart;
        return {
            cartId,
            items
        };
    }
    updateByUserId(userId, { items }) {
        return null;
    }
    updateStatusById(cartId, status) {
        return pgdb_1.PGDB.db.carts.updateStatusById(cartId, status);
    }
    async removeByUserId(userId) {
        await pgdb_1.PGDB.db.carts.deleteByUserId(userId, model_1.CartStatus.Open);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)()
], CartService);
//# sourceMappingURL=cart.service.js.map