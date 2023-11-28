import { CartStatus } from '../../pgdb/carts/model';
export declare class CartService {
    findByUserId(userId: string): Promise<{
        items: {
            [k: string]: unknown;
        }[];
        cartId: string;
        userId: string;
        createdAt: string;
        updatedAt: string;
        status: CartStatus;
    }>;
    createByUserId(userId: string): Promise<import("../../pgdb/carts/model").Cart>;
    findOrCreateByUserId(userId: string): Promise<{
        cartId: string;
        items: {
            [k: string]: unknown;
        }[];
    }>;
    updateByUserId(userId: string, { items }: {
        items: any;
    }): any;
    updateStatusById(cartId: string, status: CartStatus): Promise<boolean>;
    removeByUserId(userId: any): Promise<void>;
}
