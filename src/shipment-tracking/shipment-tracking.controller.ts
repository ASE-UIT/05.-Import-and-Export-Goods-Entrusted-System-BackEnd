import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ShipmentTrackingService } from './shipment-tracking.service';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  CreateShipmentTrackingDto,
  CreateShipmentTrackingSchema,
  UpdateShipmentTrackingDto,
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
import { SuccessResponse } from '@/shared/classes/success-response.class';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { createResponseType } from '@/shared/helpers/create-response.mixin';
import {
  ShipmentTracking,
  ShipmentTrackingStatus,
} from './models/shipment-tracking.model';
import { ValidationError } from '@/shared/classes/validation-error.class';

@ApiTags('Shipment trackings')
@Controller({ path: 'shipment-tracking', version: '1' })
export class ShipmentTrackingController {
  constructor(private shipTrackingService: ShipmentTrackingService) {}

  @ApiOperation({ summary: "Update a shipment's tracking information" })
  @ApiBody({
    type: UpdateShipmentTrackingDto,
    examples: {
      example: {
        description:
          'Able to update one or more fields in UpdateShipmentTrackingDto',
        value: {
          status: 'Updated status',
          location: 'Updated location',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Shipment tracking updated',
    type: createResponseType('Shipment tracking updated', ShipmentTracking),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description:
      "Authentication is required to update a shipment's information",
    type: UnauthorizedException,
    example: new UnauthorizedException().getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | DOCUMENTATION | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException().getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided shipment tracking information does not exist',
    type: NotFoundException,
    example: new NotFoundException().getResponse(),
  })
  @ApiResponse({ status: 409, description: 'Conflict', type: ValidationError })
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
    return new SuccessResponse('Shipment tracking updated', updatedData);
  }

  @ApiOperation({ summary: 'Search for shipment trackings' })
  @ApiQuery({
    name: 'status',
    enum: ShipmentTrackingStatus,
    required: false,
    description: 'Search shipment trac by status',
  })
  @ApiQuery({
    name: 'location',
    type: String,
    required: false,
    description: 'Search shipment by location',
  })
  @ApiQuery({
    name: 'shipmentId',
    type: String,
    required: false,
    description: 'Search shipment by shipmentId',
  })
  @ApiResponse({
    status: 200,
    description: 'Shipment tracking founded',
    example: {
      id: 'dc4abb20-a6d9-47fc-a5c5-4b7379c7f21c',
      status: 'PENDING',
      location: 'Some where updated',
      shipmentId: '1dd8e39d-26fe-445b-9efa-9d1187ce0e27',
    },
  })
  @ApiResponse({
    status: 401,
    description:
      "Authentication is required to find a shipment's tracking information",
    type: UnauthorizedException,
    example: new UnauthorizedException().getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | DOCUMENTATION | MANAGER] can perform this action',
    type: ForbiddenException,

    example: new ForbiddenException().getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Shipment tracking not found',
    type: NotFoundException,
    example: new NotFoundException().getResponse(),
  })
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
