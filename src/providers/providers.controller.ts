import {
  BadRequestException,
  Body,
  ConflictException,
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
import { ProvidersService } from './providers.service';
import { FindProviderStrategy } from './strategies/find-providers/find-providers-strategy.enum';
import { QueryProviderDto, QueryProviderSchema } from './dtos/query-providers.dto';
import {
  CreateProviderDto,
  CreateProviderSchema,
  UpdateProviderDto,
} from './dtos/create-providers.dto';
import { RoleGuard } from '@/shared/guards/role.guard';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Provider, ProviderStatus } from './models/providers.model';
import { SuccessResponse } from '@/shared/classes/success-response.class';
import { createResponseType } from '@/shared/helpers/create-response.mixin';
import { ValidationError } from '@/shared/classes/validation-error.class';
import { ZodValidationPipe } from 'nestjs-zod';

@ApiTags('Providers')
@Controller({
  path: 'providers',
  version: '1',
})
export class ProvidersController {
  constructor(private providerService: ProvidersService) {}

  @ApiOperation({ summary: 'Search for providers' })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
    description: 'Search provider by name',
  })
  @ApiQuery({
    name: 'phone',
    type: String,
    required: false,
    description: 'Search provider by phone number',
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: false,
    description: 'Search provider by email',
  })
  @ApiQuery({
    name: 'address',
    type: String,
    required: false,
    description: 'Search provider by address',
  })
  @ApiQuery({
    name: 'country',
    type: String,
    required: false,
    description: 'Search provider by country',
  })
  @ApiQuery({
    name: 'contactRepId',
    type: String,
    required: false,
    description: 'Search provider by contact representative id',
  })
  @ApiQuery({
    name: 'status',
    enum: ProviderStatus,
    required: false,
    description: 'Search provider by status',
  })
  @ApiQuery({
    name: 'id',
    type: String,
    required: false,
    description: 'Search provider by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Provider found',
    type: Provider,
  })
  @ApiResponse({
    status: 400,
    description: 'Unrecognized key(s) in query',
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to find provider's information",
    type: UnauthorizedException,
    example: new UnauthorizedException('Only authenticated users can access this resource').getResponse(),
  })
  @ApiResponse({
    status: 403,
    description: 'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException('Only users with the following roles can access this resource: ADMIN, SALES, CUSTOMER_SERVICE, MANAGER').getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Provider not found',
    type: NotFoundException,
    example: new NotFoundException('Provider not found').getResponse(),
  })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.SALES,
    RoleEnum.CUSTOMER_SERVICE,
    RoleEnum.MANAGER,
  ])
  @Get()
  async getProviders(
    @Query(new ZodValidationPipe(QueryProviderSchema.strict())) query: QueryProviderDto,
  ) {
    const result = await this.providerService.findProvider(query);
    return new SuccessResponse('Provider found', result);
  }

  @ApiOperation({ summary: 'Create new provider' })
  @ApiResponse({
    status: 201,
    description: 'Provider created',
    type: createResponseType('Provider created', Provider),
    example: {
      "name": 'New Provider',
      "phone": '987654321',
      "email": 'newprovider@example.com',
      "address": '123 Main St',
      "country": 'Vietnam',
      "contactRepId": '123e4567-e89b-12d3-a456-426614174000',
      "status": ProviderStatus.INACTIVE,
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required to create a provider',
    type: UnauthorizedException,
    example: new UnauthorizedException('Only authenticated users can access this resource').getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException('Only users with the following roles can access this resource: ADMIN, SALES, CUSTOMER_SERVICE, MANAGER').getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided provider information does not exist',
    type: NotFoundException,
    example: new NotFoundException('Contact representative not found').getResponse(),
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
    RoleEnum.MANAGER,
  ])
  @Post()
  async createProvider(
    @Body(new ZodValidationPipe(CreateProviderSchema)) body: CreateProviderDto,
  ) {
    const createRes = await this.providerService.createProvider(body);
    return new SuccessResponse('Provider created', createRes);
  }

  @ApiOperation({ summary: "Update provider's information" })
  @ApiBody({
    type: UpdateProviderDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Provider updated',
    type: createResponseType('Provider updated', Provider),
    example: {
      "name": 'Updated Provider Name',
      "phone": '111222333',
      "email": 'updatedprovider@example.com',
      "address": 'Updated Address 123',
      "country": 'Vietnam',
      "contactRepId": '123e4567-e89b-12d3-a456-426614174001',
      "status": ProviderStatus.INACTIVE,
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to update a provider's information",
    type: UnauthorizedException,
    example: new UnauthorizedException('Only authenticated users can access this resource').getResponse(),
  })
  @ApiResponse({
    status: 403,
    description: 'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException('Only users with the following roles can access this resource: ADMIN, SALES, CUSTOMER_SERVICE, MANAGER').getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided provider information does not exist',
    type: NotFoundException,
    example: new NotFoundException('Provider not found').getResponse(),
  })
  @ApiResponse({
    status: 406,
    description: 'Provider must provide at least 4 types of freight to be active',
    type: ConflictException,
    example: {
      "message": "Provider must provide at least 4 types of freight to be active",
      "error": "Not Acceptable"
  }
})
  @ApiResponse({ 
    status: 409, 
    description: 'Conflict', 
    type: ValidationError 
  })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.SALES,
    RoleEnum.CUSTOMER_SERVICE,
    RoleEnum.MANAGER,
  ])
  @Patch(':id')
  async updateProvider(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateProviderDto)) 
    body: UpdateProviderDto,
  ) {
    if (Object.keys(body).length === 0)
      throw new BadRequestException('Body is empty or invalid field names');
    const updateResponse = await this.providerService.updateProvider(id, body);
    return new SuccessResponse('Provider updated', updateResponse);
  }
}
