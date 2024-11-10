import {
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
import { ServicesService } from './services.service';
import { Service } from './models/service.model';
import { CreateServiceDto, CreateServiceSchema, UpdateServiceDto } from './dtos/CreateServiceDto';
import { QueryServiceDto, QueryServiceSchema } from './dtos/QueryServiceDto';
import { FindServiceStrategy } from './strategies/find-service/find-service-strategy.enum';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createResponseType } from '@/shared/helpers/create-response.mixin';
import { ValidationError } from 'sequelize';
import { RoleGuard } from '@/shared/guards/role.guard';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { Roles } from '@/shared/decorators/role.decorator';
import { ZodValidationPipe } from 'nestjs-zod';

@ApiTags('Services')
@Controller({
  path: 'services',
  version: '1',
})
export class ServicesController {
  constructor(private serviceService: ServicesService) {}
  
  @ApiOperation({summary: 'Create new service'})
  @ApiResponse({
    status: 200,
    description: "Service has been created successfully",
    type: createResponseType("Service has been created successfully",Service),
  })
  @ApiResponse({
    status: 400,
    description: "Invalid request body",
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to create new service",
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description: 'Only user with role [ADMIN | CUSTOMER_SERVICE | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only user with the following roles can perform this action: ADMIN, CUSTOMER_SERVICE, MANAGER '
    ).getResponse(),
  })
  @ApiResponse({
    status: 409,
    description: 'The service already exists',
    type: ValidationError,
  })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.CUSTOMER_SERVICE,
    RoleEnum.MANAGER,
  ])
  @Post()
  async createService(
    @Body(new ZodValidationPipe(CreateServiceSchema)) body: CreateServiceDto,
  ): Promise<{ message: string; data: Service }> {
    const createRes = await this.serviceService.create(body);
    return createRes;
  }

  @ApiOperation({summary: 'Search for service'})
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
    description: 'Search for service by name'
  })
  @ApiQuery({
    name: 'shortName',
    type: String,
    required: false,
    description: 'Search for service by short name'
  })
  @ApiResponse({
    status: 200,
    description: "Service found",
    type: Service,
  })
  @ApiResponse({
    status: 400,
    description: 'Unrecognized key(s) in query',
    type: ValidationError
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to find service's information",
    type: UnauthorizedException,
  })
  @ApiResponse({
    status: 403,
    description: 'Only user with role: [ADMIN | CUSTOMER_SERVICE | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can perform this action: ADMIN, CUSTOMER_SERVICE, MANAGER',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Service matching could not be found',
    type: NotFoundException,
    example: new NotFoundException('Service matching could not be found').getResponse(),
  })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.MANAGER,
    RoleEnum.CUSTOMER_SERVICE,
  ])
  @Get()
  async findService(
    @Query(new ZodValidationPipe(QueryServiceSchema))
    query: QueryServiceDto,
  ): Promise<Service[]> {
    if (Object.keys(query).length === 0) {
      return this.serviceService.find(FindServiceStrategy.ALL, '');
    }
    const queryFields: { [key: string]: FindServiceStrategy } = {
      name: FindServiceStrategy.NAME,
      shortName: FindServiceStrategy.SHORTNAME,
      fee: FindServiceStrategy.FEE,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryServiceDto];
      if (value) {
        const service = await this.serviceService.find(strategy, value);

        if (service.length > 0) {
          if (strategy === FindServiceStrategy.ALL || service.length > 1)
            return service;
          else return [service[0]];
        }
      }
    }

    throw new NotFoundException('Service not found');
  }

  @ApiOperation({summary: "Update service's information"})
  @ApiResponse({
    status: 200,
    description: 'Service has been updated successfully',
    type: createResponseType("Service has been updated successfully",Service),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to update a service's information",
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description: 'Only user with role: [ADMIN | CUSTOMER_SERVICE | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, CUSTOMER_SERVICE, MANAGER',
    ).getResponse(),
  })
  @ApiResponse({
    status: 409,
    description: "The service already exists",
    type: ValidationError,
  })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.CUSTOMER_SERVICE,
    RoleEnum.MANAGER,
  ])
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateServiceDto))
    body: UpdateServiceDto,
  ): Promise<{ message: string; data: Service }> {
    const updateRes = await this.serviceService.update(id, body);
    return updateRes;
  }
}
