import { FirmRep } from '@/firm-representatives/models/firm-representatives.model';
import { Injectable } from '@nestjs/common';
import { IFindFirmRepsStrategy } from './find-firm-representatives-strategy.interface';

@Injectable()
export class FindFirmRepsByIdStrategy implements IFindFirmRepsStrategy {
  async find(firmRepId: string): Promise<FirmRep[] | null> {
    return FirmRep.findAll({ where: { id: firmRepId } });
  }
}