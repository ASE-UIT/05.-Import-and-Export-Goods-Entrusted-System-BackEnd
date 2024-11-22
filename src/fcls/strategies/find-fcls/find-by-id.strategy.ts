import { FCL } from '@/fcls/models/fcls.model';
import { Injectable } from '@nestjs/common';
import { IFindFclStrategy } from './find-fcls-strategy.interface';

@Injectable()
export class FindFclByIdStrategy implements IFindFclStrategy {
  async find(fcl_id: String): Promise<FCL[] | null> {
    return FCL.findAll({
      where: {id: fcl_id},
    });
  }
}