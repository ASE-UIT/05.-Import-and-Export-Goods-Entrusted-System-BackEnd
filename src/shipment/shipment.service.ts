import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShipmentDto } from './dtos/CreateShipmentDto';
import { Shipment } from './models/shipment.model';
import { FindAllShipmentStrategy } from './find-strategies/find-all.strategy';
import { FindShipmentByShipmentTypeStrategy } from './find-strategies/find-by-shipment-type.strategy';
import { FindShipmentStrategies } from './find-strategies/find-shipment-strategy.enum';
import { IFindShipmentStrategy } from './find-strategies/find-shipment-strategy.interface';
import { FindShipmentByContractIdStrategy } from './find-strategies/find-by-contract-id.strategy';

@Injectable()
export class ShipmentService {
  constructor(
    private findAllShipmentStrategy: FindAllShipmentStrategy,
    private findShipmentByShipmentTypeStrategy: FindShipmentByShipmentTypeStrategy,
    private findShipmentByContractIdStrategy: FindShipmentByContractIdStrategy,
  ) {}
  async createShipment(body: CreateShipmentDto): Promise<Shipment> {
    const shipmment = new Shipment();
    shipmment.shipmentType = body.shipmentType;
    shipmment.contractId = body.contractId;
    try {
      await shipmment.save();
      return shipmment;
    } catch (err) {
      console.log(err);
    }
  }

  async updateShipment(
    shipmentId: string,
    body: Partial<CreateShipmentDto>,
  ): Promise<Shipment> {
    try {
      const [affectedRows, [updateData]] = await Shipment.update(
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
