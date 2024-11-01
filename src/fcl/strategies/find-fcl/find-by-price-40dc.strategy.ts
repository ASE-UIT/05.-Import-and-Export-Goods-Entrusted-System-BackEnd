import { FCL } from '@/fcl/models/fcl.model';
import { Injectable } from '@nestjs/common';
import { IFindFclStrategy } from './find-fcl-strategy.interface';

@Injectable()
export class FindFclByPrice40dcStrategy implements IFindFclStrategy {
  async find(fcl40dc: number): Promise<FCL[] | null> {
    return FCL.findAll({
      where: {price_40dc: fcl40dc},
    });
  }
}