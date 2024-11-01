import { FCL } from '@/fcl/models/fcl.model';
import { Injectable} from '@nestjs/common';

@Injectable()
export class FindAllFclStrategy {
  async find(): Promise<FCL[] | null> {
    return FCL.findAll();
  }
}