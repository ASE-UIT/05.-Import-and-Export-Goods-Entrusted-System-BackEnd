import { FCL } from '@/fcls/models/fcls.model';
import { Injectable} from '@nestjs/common';

@Injectable()
export class FindAllFclStrategy {
  async find(): Promise<FCL[] | null> {
    return FCL.findAll();
  }
}