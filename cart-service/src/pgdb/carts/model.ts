export enum CartStatus {
  Open = 'open',
  Ordered = 'ordered'
}

export interface Cart {
  cartId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: CartStatus;
}