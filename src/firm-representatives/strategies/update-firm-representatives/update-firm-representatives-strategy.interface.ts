import { CreateFirmRepDto } from '@/firm-representatives/dtos/create-firm-representatives.dto';
import { FirmRep } from '@/firm-representatives/models/firm-representatives.model';

export interface IUpdateFirmRepsStrategy {
  update(firmRepId: string, updateData: Partial<CreateFirmRepDto>,): Promise<FirmRep>;
}