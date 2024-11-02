import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShipmentDto } from './dtos/create-shipment.dto';
import { Shipment } from './models/shipment.model';
import { FindAllShipmentStrategy } from './find-strategies/find-all.strategy';
import { FindShipmentByShipmentTypeStrategy } from './find-strategies/find-by-shipment-type.strategy';
import { FindShipmentStrategies } from './find-strategies/find-shipment-strategy.enum';
import { IFindShipmentStrategy } from './find-strategies/find-shipment-strategy.interface';
import { FindShipmentByContractIdStrategy } from './find-strategies/find-by-contract-id.strategy';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectModel(Shipment)
    private shipmentModel: typeof Shipment,
    private findAllShipmentStrategy: FindAllShipmentStrategy,
    private findShipmentByShipmentTypeStrategy: FindShipmentByShipmentTypeStrategy,
    private findShipmentByContractIdStrategy: FindShipmentByContractIdStrategy,
  ) {}
  async createShipment(body: CreateShipmentDto): Promise<Shipment> {
    try {
      const newShipment = await this.shipmentModel.create({
        shipmentType: body.shipmentType,
        contractId: body.contractId,
      });
      return newShipment;
    } catch (err) {
      console.log(err);
    }
  }

  async updateShipment(
    shipmentId: string,
    body: Partial<CreateShipmentDto>,
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

  getFindStrategy(strategy: FindShipmentStrategies): IFindShipmentStrategy {
    switch (strategy) {
      case FindShipmentStrategies.ALL:
        return this.findAllShipmentStrategy;
      case FindShipmentStrategies.CONTRACT_ID:
        return this.findShipmentByContractIdStrategy;
      case FindShipmentStrategies.SHIPMENT_TYPE:
        return this.findShipmentByShipmentTypeStrategy;
    }
  }

  async findShipment(
    strategy: FindShipmentStrategies,
    shipmentInfo: string,
  ): Promise<Shipment[]> {
    const findStrategy = this.getFindStrategy(strategy);
    const shipment = await findStrategy.find(shipmentInfo);
    return shipment;
  }
}
