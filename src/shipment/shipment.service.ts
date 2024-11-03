import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateShipmentDto,
  UpdateShipmentDto,
} from './dtos/create-shipment.dto';
import { Shipment } from './models/shipment.model';
import { InjectModel } from '@nestjs/sequelize';
import { ForeignKeyConstraintError } from 'sequelize';
import { QueryShipmentDto } from './dtos/query-shipment.dto';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectModel(Shipment)
    private shipmentModel: typeof Shipment,
  ) {}
  async createShipment(body: CreateShipmentDto): Promise<Shipment> {
    try {
      const newShipment = await this.shipmentModel.create({
        shipmentType: body.shipmentType,
        contractId: body.contractId,
      });
      return newShipment;
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        throw new NotFoundException('Contract id not found');
      }
    }
  }

  async updateShipment(
    shipmentId: string,
    body: UpdateShipmentDto,
  ): Promise<Shipment> {
    try {
      const [affectedRows, [updateData]] = await this.shipmentModel.update(
        { ...body },
        { where: { id: shipmentId }, returning: true },
      );
      return updateData.dataValues as Shipment;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('Shipment not found');
      }
    }
  }

  async findShipment(query: QueryShipmentDto): Promise<Shipment[]> {
    let shipment: Shipment[];
    if (query) shipment = await Shipment.findAll({ where: query });
    else shipment = await Shipment.findAll();

    if (shipment.length > 0) return shipment;
    else throw new NotFoundException('Shipment not found');
  }
}
