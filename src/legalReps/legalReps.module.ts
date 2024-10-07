import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LegalRepsService } from './legalReps.service';
import { LegalRep } from './models/legalReps.model';
import { LegalRepsController } from './legalReps.controller';
import { CreateLegalRepsStrategy } from './strategies/create-legal-rep/create-legal-rep.strategy';
import { UpdateLegalRepsStrategy } from './strategies/update-legal-rep/update-legal-rep.strategy';
import { FindAllLegalRepsStrategy } from './strategies/find-legal-rep/find-all.strategy';
import { FindLegalRepsByCustomerIdStrategy } from './strategies/find-legal-rep/find-by-customer-id.strategy';
import { FindLegalRepsByEmailStrategy } from './strategies/find-legal-rep/find-by-email.strategy';
import { FindLegalRepsByNameStrategy } from './strategies/find-legal-rep/find-by-name.strategy';
import { FindLegalRepsByPhoneStrategy } from './strategies/find-legal-rep/find-by-phone.strategy';

@Module({
  imports: [SequelizeModule.forFeature([LegalRep])],
  controllers: [LegalRepsController],
  providers: [
    LegalRepsService,
    CreateLegalRepsStrategy,
    UpdateLegalRepsStrategy,
    FindAllLegalRepsStrategy,
    FindLegalRepsByCustomerIdStrategy,
    FindLegalRepsByEmailStrategy,
    FindLegalRepsByNameStrategy,
    FindLegalRepsByPhoneStrategy,
  ],
})
export class LegalRepsModule {}
