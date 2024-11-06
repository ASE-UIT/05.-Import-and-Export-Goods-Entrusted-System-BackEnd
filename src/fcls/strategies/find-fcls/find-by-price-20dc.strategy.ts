import { FCL } from '@/fcls/models/fcls.model';
import { Injectable } from '@nestjs/common';
import { IFindFclStrategy } from './find-fcls-strategy.interface';

@Injectable()
export class FindFclByPrice20dcStrategy implements IFindFclStrategy {
  async find(fcl20dc: number): Promise<FCL[] | null> {
    return FCL.findAll({
      where: {price_20dc: fcl20dc},
    });
  }
}