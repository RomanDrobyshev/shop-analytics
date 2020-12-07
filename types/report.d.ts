export namespace Report {
  interface Order {
    cashFlow: number;
    sales: number;
    productId: number;
    variant: string;
  }
  export interface DayReport {
    _id: string;
    report: Record<'30d'|'60d'|'90d'|'180d', Order[]>;
  }
  export interface Structure {
    _id: Date;
    report: Record<'30d'|'60d'|'90d'|'180d', Order[]>;
  }
}
