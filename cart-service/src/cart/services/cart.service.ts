import { Injectable } from '@nestjs/common';
import { PGDB } from '../../pgdb';
import { CartStatus } from '../../pgdb/carts/model';

@Injectable()
export class CartService {
  async findByUserId(userId: string) {
    const cart = await PGDB.db.carts.findByUserId(userId, CartStatus.Open);

    if (!cart) return null;

    return {
      ...cart,
      items: await PGDB.db.cartItems.findManyByCartId(cart.cartId)
    };
  }

  createByUserId(userId: string) {
    return PGDB.db.carts.create({ userId });
  }

  async findOrCreateByUserId(userId: string) {
    let userCart = await PGDB.db.carts.findByUserId(userId, CartStatus.Open);
    const items = userCart?.cartId ? await PGDB.db.cartItems.findManyByCartId(userCart.cartId) : [];
    userCart ??= await this.createByUserId(userId)
    const { cartId } = userCart

    return {
      cartId,
      items
    }
  }

  updateByUserId(userId: string, { items }) {
    // Skipped this method
    return null;
  }

  updateStatusById(cartId: string, status: CartStatus) {
    return PGDB.db.carts.updateStatusById(cartId, status);
  }

  async removeByUserId(userId) {
    await PGDB.db.carts.deleteByUserId(userId, CartStatus.Open)
  }

}
