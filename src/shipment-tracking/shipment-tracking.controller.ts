import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ShipmentTrackingService } from './shipment-tracking.service';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  CreateShipmentTrackingDto,
  CreateShipmentTrackingSchema,
} from './dtos/create-shipment-tracking.dto';
import {
  QueryShipmentTrackingDto,
  QueryShipmentTrackingSchema,
} from './dtos/query-shipment-tracking.dto';
import { query } from 'express';
import { FindShipmentTrackingStrategies } from './find-strategies/find-shipment-tracking-strategy.enum';
import { RoleGuard } from '@/shared/guards/role.guard';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';

@Controller({ path: 'shipment-tracking', version: '1' })
export class ShipmentTrackingController {
  constructor(private shipTrackingService: ShipmentTrackingService) {}

  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.SALES,
    RoleEnum.CUSTOMER_SERVICE,
    RoleEnum.DOCUMENTATION,
    RoleEnum.MANAGER,
  ])
  @Patch(':id')
  async updateShipmentTracking(
    @Param('id') id: string,
    @Body(
      new ZodValidationPipe(
        CreateShipmentTrackingSchema.partial().omit({ shipmentId: true }),
      ),
    )
    body: Partial<CreateShipmentTrackingDto>,
  ) {
    if (Object.keys(body).length === 0)
      throw new BadRequestException('Body is empty or invalid field names');
    const updatedData = await this.shipTrackingService.updateShipmentTracking(
      id,
      body,
    );
    return { message: 'Shipment tracking updated', data: updatedData };
  }

  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.SALES,
    RoleEnum.CUSTOMER_SERVICE,
    RoleEnum.DOCUMENTATION,
    RoleEnum.MANAGER,
  ])
  @Get()
  async getShipmentTracking(
    @Query(new ZodValidationPipe(QueryShipmentTrackingSchema.partial()))
    query: Partial<QueryShipmentTrackingDto>,
  ) {
    if (Object.keys(query).length === 0) {
      return await this.shipTrackingService.findShipmentTracking(
        FindShipmentTrackingStrategies.ALL,
        '',
      );
    }

    // Get query fields

    const queryFields: { [key: string]: FindShipmentTrackingStrategies } = {
      shipmentId: FindShipmentTrackingStrategies.SHIPMENT_ID,
      location: FindShipmentTrackingStrategies.LOCATION,
      status: FindShipmentTrackingStrategies.STATUS,
    };

    // Assign corrisponding strategy to query fields
    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryShipmentTrackingDto];
      if (value) {
        const shipment = await this.shipTrackingService.findShipmentTracking(
          strategy,
          value,
        );
        if (shipment.length > 0) {
          if (
            strategy === FindShipmentTrackingStrategies.ALL ||
            shipment.length > 1
          )
            return shipment;
          else return shipment[0];
        }
      }
    }

    // Cant find customer
    throw new NotFoundException('Tracking not found');
  }
}
