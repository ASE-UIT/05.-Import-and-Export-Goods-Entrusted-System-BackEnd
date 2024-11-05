import { FCL } from '@/fcls/models/fcls.model';
import { Injectable } from '@nestjs/common';
import { IFindFclStrategy } from './find-fcls-strategy.interface';

@Injectable()
export class FindFclByPrice40hcStrategy implements IFindFclStrategy {
  async find(fcl40hc: number): Promise<FCL[] | null> {
    return FCL.findAll({
      where: {price_40hc: fcl40hc},
    });
  }
}