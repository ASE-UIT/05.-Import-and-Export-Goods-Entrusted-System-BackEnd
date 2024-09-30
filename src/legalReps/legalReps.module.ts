import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LegalRepsService } from './legalReps.service';
import { LegalRep } from './models/legalReps.model';
import { LegalRepsController } from './legalReps.controller';

@Module({
  imports: [SequelizeModule.forFeature([LegalRep])],
  controllers: [LegalRepsController],
  providers: [LegalRepsService],
})
export class LegalRepsModule {}
