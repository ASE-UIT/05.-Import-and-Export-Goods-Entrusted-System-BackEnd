import { Injectable } from '@nestjs/common';
import { FCL } from '@/fcl/models/fcl.model'; 
import { Freight } from '@/freight/models/freight.model'; 
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UniqueConstraintError } from 'sequelize';
import { ICreateFclStrategy } from './create-fcl-strategy.interface';
import { InjectModel } from '@nestjs/sequelize';
import { CreateFclDto } from '@/fcl/dtos/CreateFclDto';

@Injectable()
export class CreateFclStrategy implements ICreateFclStrategy {
  constructor(
    @InjectModel(Freight)
    private readonly freightRepository: typeof Freight,
  ) {}

  async create(fclData: CreateFclDto): Promise<FCL> {
    const freight = await this.freightRepository.findByPk(fclData.freight_id);
    
    if (!freight) {
      throw new NotFoundException('Freight not found');
    }

    const fcl = new FCL();
    fcl.price_20dc = fclData.price_20dc;
    fcl.price_20rf = fclData.price_20rf;
    fcl.price_40dc = fclData.price_40dc;
    fcl.price_40hc = fclData.price_40hc;
    fcl.price_40rf = fclData.price_40rf;
    fcl.freight_id = fclData.freight_id;

    try {
      await fcl.save();
      return fcl;
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
      throw new ConflictException('Failed to create FCL');
    }
  }
}
