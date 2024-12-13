import { FirmRep } from '@/firm-representatives/models/firm-representatives.model';

export interface IFindFirmRepsStrategy {
  find(firmRepInfo: string): Promise<FirmRep[] | null>;
}