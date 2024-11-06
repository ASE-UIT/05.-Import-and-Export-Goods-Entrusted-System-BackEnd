import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LegalRepsService } from './legal-rep.service';
import { LegalRep } from './models/legal-rep.model';
import { LegalRepsController } from './legal-rep.controller';
import { CreateLegalRepsStrategy } from './strategies/create-legal-rep/create-legal-rep.strategy';
import { UpdateLegalRepsStrategy } from './strategies/update-legal-rep/update-legal-rep.strategy';

@Module({
  imports: [SequelizeModule.forFeature([LegalRep])],
  controllers: [LegalRepsController],
  providers: [
    LegalRepsService,
    CreateLegalRepsStrategy,
    UpdateLegalRepsStrategy,
  ],
})
export class LegalRepsModule {}
