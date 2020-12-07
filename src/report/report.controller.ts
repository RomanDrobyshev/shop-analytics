import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { generateReport } from 'utils/report';
import { OrderCollectionService } from '../common/services/OrderCollection.service';
import { ReportCollectionService } from '../common/services/ReportCollection.service';
import { ReportOutDto } from './dto/report.dto';
import { getLastReport } from '../../utils/getLastReport';

@Controller('/v1/report')
export class ReportController {
  constructor(
    private reportCollectionService: ReportCollectionService,
    private orderCollectionService: OrderCollectionService,
  ) {}

  @ApiTags('Reports')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Successful operation', type: ReportOutDto })
  @Get('/')
  async getReport(): Promise<ReportOutDto> {
    let report = await getLastReport(this.reportCollectionService.collection);
    if (!report) {
      report = await generateReport(
        this.orderCollectionService.collection,
        this.reportCollectionService.collection,
      );
    }

    return new ReportOutDto(report);
  }
}
