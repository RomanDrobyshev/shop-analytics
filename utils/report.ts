import { Collection, FilterQuery } from 'mongodb';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { Report } from '../types/report';

dayjs.extend(utc);

export async function generateReport(
  orderCollection: Collection,
  reportCollection: Collection,
  days: number[] = [30, 60, 90, 180],
): Promise<Report.Structure> {
  const today = dayjs().local();
  const formatTemplate = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';
  const maxRange = Math.max.apply(null, days);
  const maxRangeDate = today
    .subtract(maxRange, 'day')
    .format(formatTemplate);

  const matchStage: Record<string, FilterQuery<unknown>> = { $match: { 'order.orderDate': { $gte: maxRangeDate } } };
  const facetStages = days.reduce((queryAcc, day): Record<string, unknown> => {
    if (day !== maxRange) {
      queryAcc.$facet[`${day}d`] = [
        {
          $match: {
            'order.orderDate': { $gte: today.subtract(day, 'day').format(formatTemplate) },
          },
        },
        {
          $group: {
            _id: { variant: '$variant', productId: '$productId' },
            cashFlow: { $sum: '$order.price' },
            sales: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: { variant: '$_id.variant' },
            maxCashFlow: { $max: '$cashFlow' },
            items: { $push: { productId: '$_id.productId', sales: '$sales', cashFlow: '$cashFlow' } },
          },
        },
        {
          $project: {
            _id: 0,
            variant: '$_id.variant',
            cashFlow: '$maxCashFlow',
            productInfo: {
              $filter: {
                input: '$items',
                as: 'item',
                cond: {
                  $eq: ['$$item.cashFlow', '$maxCashFlow'],
                },
              },
            },
          },
        },
        {
          $project: {
            variant: '$variant',
            cashFlow: '$cashFlow',
            productId: {
              $arrayElemAt: ['$productInfo.productId', 0],
            },
            sales: {
              $arrayElemAt: ['$productInfo.sales', 0],
            },
          },
        },
      ];
      return queryAcc;
    }
    queryAcc.$facet[`${day}d`] = [
      {
        $group: {
          _id: { variant: '$variant', productId: '$productId' },
          cashFlow: { $sum: '$order.price' },
          sales: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: { variant: '$_id.variant' },
          maxCashFlow: { $max: '$cashFlow' },
          items: { $push: { productId: '$_id.productId', sales: '$sales', cashFlow: '$cashFlow' } },
        },
      },
      {
        $project: {
          _id: 0,
          variant: '$_id.variant',
          cashFlow: '$maxCashFlow',
          productInfo: {
            $filter: {
              input: '$items',
              as: 'item',
              cond: {
                $eq: ['$$item.cashFlow', '$maxCashFlow'],
              },
            },
          },
        },
      },
      {
        $project: {
          variant: '$variant',
          cashFlow: '$cashFlow',
          productId: {
            $arrayElemAt: ['$productInfo.productId', 0],
          },
          sales: {
            $arrayElemAt: ['$productInfo.sales', 0],
          },
        },
      },
    ];
    return queryAcc;
  }, {
    $facet: {},
  });

  const data: Report.Structure[] = await orderCollection.aggregate(
    [matchStage, facetStages],
  ).toArray();

  await reportCollection.insertOne({
    _id: dayjs.utc().format('YYYY-MM-DD'),
    report: data,
  });

  return data[0];
}
