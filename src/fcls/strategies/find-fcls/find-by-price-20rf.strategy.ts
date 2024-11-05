import { FCL } from '@/fcls/models/fcls.model';
import { Injectable } from '@nestjs/common';
import { IFindFclStrategy } from './find-fcls-strategy.interface';

@Injectable()
export class FindFclByPrice20rfStrategy implements IFindFclStrategy {
  async find(fcl20rf: number): Promise<FCL[] | null> {
    return FCL.findAll({
      where: {price_20rf: fcl20rf},
    });
  }
}