import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  CreateShipmentDto,
  CreateShipmentSchema,
  UpdateShipmentDto,
} from './dtos/create-shipment.dto';
import { ShipmentService } from './shipment.service';
import { ShipmentTrackingService } from '@/shipment-tracking/shipment-tracking.service';
import { CreateShipmentTrackingDto } from '@/shipment-tracking/dtos/create-shipment-tracking.dto';
import {
  QueryShipmentDto,
  QueryShipmentSchema,
} from './dtos/query-shipment.dto';
import { FindShipmentStrategies } from './find-strategies/find-shipment-strategy.enum';
import { RoleGuard } from '@/shared/guards/role.guard';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SuccessResponse } from '@/shared/classes/success-response.class';
import { createResponseType } from '@/shared/helpers/create-response.mixin';
import { ValidationError } from '@/shared/classes/validation-error.class';
import { Shipment, ShipmentType } from './models/shipment.model';

@ApiTags('Shipments')
@Controller({ path: 'shipment', version: '1' })
export class ShipmentController {
  constructor(
    private shipmentService: ShipmentService,
    private shipmentTrackingService: ShipmentTrackingService,
  ) {}

  @ApiOperation({ summary: 'Create a new shipment along with its tracking' })
  @ApiResponse({
    status: 201,
    description: 'Shipment and its tracking successfully created',
    type: createResponseType(
      'Shipment and its tracking successfully created',
      Shipment,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required to create a shipment',
    type: UnauthorizedException,
    example: new UnauthorizedException().getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | DOCUMENTATION] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException().getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided shipment information does not exist',
    type: NotFoundException,
    example: new NotFoundException().getResponse(),
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ValidationError,
  })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.SALES,
    RoleEnum.CUSTOMER_SERVICE,
    RoleEnum.DOCUMENTATION,
  ])
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
    return new SuccessResponse(
      'Shipment and its tracking successfully created',
      {
        shipment: shipment,
        tracking: tracker,
      },
    );
  }

  @ApiOperation({ summary: "Update a shipment's information" })
  @ApiBody({
    type: UpdateShipmentDto,
    examples: {
      example: {
        description: 'Able to update one or more fields in UpdateShipmentDto',
        value: {
          shipmentType: 'Updated type',
          contractId: 'Updated contractId',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Shipment updated successfully',
    type: createResponseType('Shipment updated successfully', Shipment),
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
      'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | DOCUMENTATION] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException().getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided shipment information does not exist',
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
  ])
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
    return new SuccessResponse('Shipment updated successfully', updateResponse);
  }

  @ApiOperation({ summary: 'Search for shipments' })
  @ApiQuery({
    name: 'shipmentType',
    enum: ShipmentType,
    required: false,
    description: 'Search shipment by type',
  })
  @ApiQuery({
    name: 'contractId',
    type: String,
    required: false,
    description: 'Search shipment by contract id',
  })
  @ApiResponse({
    status: 200,
    description: 'Shipment founded',
    example: {
      id: 'bd55389f-c552-4976-95ab-a68ac1241142',
      shipmentType: 'LAND',
      contractId: '1',
    },
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to find shipment's information",
    type: UnauthorizedException,
    example: new UnauthorizedException().getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | DOCUMENTATION] can perform this action',
    type: ForbiddenException,

    example: new ForbiddenException().getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Shipment not found',
    type: NotFoundException,
    example: new NotFoundException().getResponse(),
  })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.SALES,
    RoleEnum.CUSTOMER_SERVICE,
    RoleEnum.DOCUMENTATION,
  ])
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
