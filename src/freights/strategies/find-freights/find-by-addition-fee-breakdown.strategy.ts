import { Injectable } from '@nestjs/common';
import { Freight } from '@/freights/models/freights.model';
import { IFindFreightStrategy } from './find-freights-strategy.interface';

@Injectable()
export class FindFreightByAdditionFeeBreakdownStrategy implements IFindFreightStrategy {
  async find(freightAdditionFeeBreakdown: string): Promise<Freight[] | null> {
    return Freight.findAll({
      where: {addition_fee_breakdown: freightAdditionFeeBreakdown},
    });
  }
}