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
  // UpdateShipmentDto,
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
import { PaginationDto, PaginationSchema } from '@/shared/dto/pagination.dto';

@ApiTags('Shipment')
@Controller({ path: 'shipment', version: '1' })
export class ShipmentController {
  constructor(
    private shipmentService: ShipmentService,
    private shipmentTrackingService: ShipmentTrackingService,
  ) {}

  @ApiOperation({ summary: 'Create a new shipment along with its tracking' })
  @ApiResponse({
    status: 201,
    description: 'Shipment and its tracking created',
    type: createResponseType('Shipment and its tracking created', Shipment),
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
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | DOCUMENTATION] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, SALES, CUSTOMER_SERVICE, DOCUMENTATION',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided shipment information does not exist',
    type: NotFoundException,
    example: new NotFoundException('Contract id not found').getResponse(),
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
    return new SuccessResponse('Shipment and its tracking created', {
      shipment: shipment,
      tracking: tracker,
    });
  }

  // @ApiOperation({ summary: "Update a shipment's information" })
  // @ApiBody({
  //   type: UpdateShipmentDto,
  // })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Shipment updated successfully',
  //   type: createResponseType('Shipment updated successfully', Shipment),
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Invalid request body',
  //   type: ValidationError,
  // })
  // @ApiResponse({
  //   status: 401,
  //   description:
  //     "Authentication is required to update a shipment's information",
  //   type: UnauthorizedException,
  //   example: new UnauthorizedException(
  //     'Only authenticated users can access this resource',
  //   ).getResponse(),
  // })
  // @ApiResponse({
  //   status: 403,
  //   description:
  //     'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | DOCUMENTATION] can perform this action',
  //   type: ForbiddenException,
  //   example: new ForbiddenException(
  //     'Only users with the following roles can access this resource: ADMIN, SALES, CUSTOMER_SERVICE, DOCUMENTATION',
  //   ).getResponse(),
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'The provided shipment information does not exist',
  //   type: NotFoundException,
  //   example: new NotFoundException('Shipment not found').getResponse(),
  // })
  // @ApiResponse({ status: 409, description: 'Conflict', type: ValidationError })
  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.CUSTOMER_SERVICE,
  //   RoleEnum.DOCUMENTATION,
  // ])
  // @Patch(':id')
  // async updateShipment(
  //   @Param('id') id: string,
  //   @Body(new ZodValidationPipe(UpdateShipmentDto))
  //   body: UpdateShipmentDto,
  // ) {
  //   if (Object.keys(body).length === 0)
  //     throw new BadRequestException('Body is empty or invalid field names');
  //   const updateResponse = await this.shipmentService.updateShipment(id, body);
  //   return new SuccessResponse('Shipment updated successfully', updateResponse);
  // }

  @ApiOperation({ summary: 'Search for shipment' })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: true,
    description: 'Current page',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: true,
    description: 'Total records per page',
  })
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
    description: 'Success',
    type: Shipment,
  })
  @ApiResponse({
    status: 400,
    description: 'Unrecognized key(s) in query',
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to find shipment's information",
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | DOCUMENTATION] can perform this action',
    type: ForbiddenException,

    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, SALES, CUSTOMER_SERVICE, DOCUMENTATION',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Shipment not found',
    type: NotFoundException,
    example: new NotFoundException('Shipment not found').getResponse(),
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
    @Query(new ZodValidationPipe(PaginationSchema))
    pagination: PaginationDto,
  ) {
    const result = await this.shipmentService.findShipment(query, pagination);
    return new SuccessResponse('Success', result);
  }

  @ApiOperation({ summary: 'Search for shipment by id' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Shipment,
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to find shipment's information",
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | DOCUMENTATION] can perform this action',
    type: ForbiddenException,

    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, SALES, CUSTOMER_SERVICE, DOCUMENTATION',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Shipment not found',
    type: NotFoundException,
    example: new NotFoundException('Shipment not found').getResponse(),
  })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.SALES,
    RoleEnum.CUSTOMER_SERVICE,
    RoleEnum.DOCUMENTATION,
  ])
  @Get(':id')
  async findShipmentById(
    @Param('id')
    id: string,
  ) {
    console.log(id);
    const result = await this.shipmentService.findShipmentById(id);
    return new SuccessResponse('Success', result);
  }
}
