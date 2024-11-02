import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  CreateShipmentDto,
  CreateShipmentSchema,
} from './dtos/CreateShipmentDto';
import { ShipmentService } from './shipment.service';
import { ShipmentTrackingService } from '@/shipment-tracking/shipment-tracking.service';
import { CreateShipmentTrackingDto } from '@/shipment-tracking/dtos/CreateShipmentTrackingDto';
import { QueryShipmentDto, QueryShipmentSchema } from './dtos/QueryShipmentDto';
import { FindShipmentStrategies } from './find-strategies/find-shipment-strategy.enum';

@Controller({ path: 'shipment', version: '1' })
export class ShipmentController {
  constructor(
    private shipmentService: ShipmentService,
    private shipmentTrackingService: ShipmentTrackingService,
  ) {}
  @Post()
  async createShipment(
    @Body(new ZodValidationPipe(CreateShipmentSchema)) body: CreateShipmentDto,
  ) {
    const shipment = await this.shipmentService.createShipment(body);
    const trackerBody: CreateShipmentTrackingDto = {
      shipmentId: shipment.id,
      location: body.location,
      status: body.status,
    };
    const tracker =
      await this.shipmentTrackingService.createShipmentTracking(trackerBody);
    return {
      message: 'Shipment & Tracking created',
      data: { shipment: shipment, tracking: tracker },
    };
  }

  @Patch(':id')
  async updateShipment(
    @Param('id') id: string,
    @Body(
      new ZodValidationPipe(
        CreateShipmentSchema.partial().omit({
          location: true,
          status: true,
          contractId: true,
        }),
      ),
    )
    body: Partial<CreateShipmentDto>,
  ) {
    if (Object.keys(body).length === 0)
      throw new BadRequestException('Body is empty or invalid field names');
    const updateResponse = await this.shipmentService.updateShipment(id, body);
    return { message: 'Shipment updated successfully', data: updateResponse };
  }

  @Get()
  async findShipment(
    @Query(new ZodValidationPipe(QueryShipmentSchema.partial()))
    query: Partial<QueryShipmentDto>,
  ) {
    if (Object.keys(query).length === 0)
      return await this.shipmentService.findShipment(
        FindShipmentStrategies.ALL,
        '',
      );

    // Get query fields

    const queryFields: { [key: string]: FindShipmentStrategies } = {
      contractId: FindShipmentStrategies.CONTRACT_ID,
      shipmentType: FindShipmentStrategies.SHIPMENT_TYPE,
    };

    // Assign corrisponding strategy to query fields
    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryShipmentDto];
      if (value) {
        const shipment = await this.shipmentService.findShipment(
          strategy,
          value,
        );
        if (shipment.length > 0) {
          if (strategy === FindShipmentStrategies.ALL || shipment.length > 1)
            return shipment;
          else return shipment[0];
        }
      }
    }

    // Cant find customer
    throw new NotFoundException('Shipment not found');
  }
}
