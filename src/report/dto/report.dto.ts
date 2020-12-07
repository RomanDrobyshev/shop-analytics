import { ApiProperty } from '@nestjs/swagger';
import { Report } from '../../../types/report';

class Order {
  @ApiProperty()
  cashFlow: number;

  @ApiProperty()
  sales: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  variant: string;
}

class BestSellers {
  @ApiProperty({ type: [Order] })
  '30d': Order[];

  @ApiProperty({ type: [Order] })
  '60d': Order[];

  @ApiProperty({ type: [Order] })
  '90d': Order[];

  @ApiProperty({ type: [Order] })
  '180d': Order[];
}
class A {
  @ApiProperty()
  bestSellers: BestSellers;
}
export class ReportOutDto {
  @ApiProperty()
  private statusCode: number;

  @ApiProperty()
  private data: A;

  constructor(data: Report.Structure, statusCode = 1) {
    this.statusCode = statusCode;
    this.data = {
      bestSellers: data.report,
    };
  }
}
