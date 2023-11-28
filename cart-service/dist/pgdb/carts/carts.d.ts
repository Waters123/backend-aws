import Connect from '../connect';
import { Cart, CartStatus } from './model';
declare class PGCarts {
    private readonly client;
    private readonly tableName;
    constructor(client: Connect);
    findById(cartId: string): Promise<{
        [k: string]: unknown;
    }>;
    findByUserId(userId: string, status?: CartStatus): Promise<Cart | null>;
    create(data: Pick<Cart, 'userId'>): Promise<Cart>;
    updateStatusById(cartId: string, status: CartStatus): Promise<boolean>;
    updateStatusByUserId(userId: string, status: CartStatus): Promise<boolean>;
    deleteById(cartId: string): Promise<boolean>;
    deleteByUserId(userId: string, status?: CartStatus): Promise<boolean>;
}
export default PGCarts;
