import { FirmRep } from '@/firm-representatives/models/firm-representatives.model';
import { Injectable } from '@nestjs/common';
import { IFindFirmRepsStrategy } from './find-firm-representatives-strategy.interface';

@Injectable()
export class FindFirmRepsByPhoneStrategy implements IFindFirmRepsStrategy {
  async find(firmRepPhone: string): Promise<FirmRep[] | null> {
    return FirmRep.findAll({ where: { phone: firmRepPhone } });
  }
}