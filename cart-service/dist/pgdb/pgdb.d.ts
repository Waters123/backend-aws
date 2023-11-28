import Connect from './connect';
import Carts from './carts/carts';
import CartItems from './cart-items/cart-items';
export declare class PGDB {
    private readonly _client;
    private constructor();
    private static _instance;
    private _carts;
    private _cartItems;
    static init(client: Connect): void;
    static get db(): PGDB;
    get carts(): Carts;
    transactionQuery(callback: () => Promise<void>): Promise<void>;
    get cartItems(): CartItems;
}
