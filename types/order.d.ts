export namespace Order {
  export interface Product {
    productId: number;
    variant: string;
    order: {
      orderDate: Date;
      price: number;
    }
  }
}
