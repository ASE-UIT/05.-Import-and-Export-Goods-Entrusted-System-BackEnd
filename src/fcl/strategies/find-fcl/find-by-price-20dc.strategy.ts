import { FCL } from '@/fcl/models/fcl.model';
import { Injectable } from '@nestjs/common';
import { IFindFclStrategy } from './find-fcl-strategy.interface';

@Injectable()
export class FindFclByPrice20dcStrategy implements IFindFclStrategy {
  async find(fcl20dc: number): Promise<FCL[] | null> {
    return FCL.findAll({
      where: {price_20dc: fcl20dc},
    });
  }
}