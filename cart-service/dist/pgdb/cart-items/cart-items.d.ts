import Connect from '../connect';
import { CartItem } from './model';
declare class PGCartItems {
    private readonly client;
    private readonly tableName;
    constructor(client: Connect);
    findManyByCartId(cartId: string | string[]): Promise<{
        [k: string]: unknown;
    }[]>;
    createMany(cartId: string, data: Omit<CartItem, 'cartId'>[]): Promise<CartItem[]>;
    delete(cartId: string, productId?: string): Promise<boolean>;
}
export default PGCartItems;
