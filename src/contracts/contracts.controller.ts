import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotAcceptableException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  CreateContractDto,
  CreateContractSchema,
  UpdateContractDto,
} from './dtos/create-contract.dto';
import { Contract } from './models/contract.model';
import { ContractsService } from './contracts.service';
import {
  QueryContractDto,
  QueryContractSchema,
} from './dtos/query-contract.dto';
import { FindContractStrategy } from './strategies/find-contract/find-contract-strategy.enum';
import { RoleGuard } from '@/shared/guards/role.guard';
import { ContractStatus } from '@/shared/enums/contract-status.enum';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { Roles } from '@/shared/decorators/role.decorator';
import { ValidationError } from '@/shared/classes/validation-error.class';
import { SuccessResponse } from '@/shared/classes/success-response.class';
import { createResponseType } from '@/shared/helpers/create-response.mixi';

@ApiTags('Contracts')
@Controller({
  path: 'contracts',
  version: '1',
})
export class ContractsController {
  constructor(private contractsService: ContractsService) { }

  @ApiOperation({ summary: 'Create a new contract' })
  @ApiResponse({
    status: 201,
    description: 'Contract created',
    type: createResponseType('Contract created successfully', Contract),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required to create a contract',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | SALES | ACCOUNTANT] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, SALES, ACCOUNTANT',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
    type: ForbiddenException,
    example: {
      NotFoundEmployee: {
        summary: 'The provided employeeId does not exist',
        value: new NotFoundException("Employee doesn't exist").getResponse(),
      },
      NotFoundQuotation: {
        summary: 'The provided quotationId does not exist',
        value: new NotFoundException("Quotation doesn't exist").getResponse(),
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ValidationError,
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.SALES, RoleEnum.ACCOUNTANT])
  @Post()
  async createContract(
    @Body(new ZodValidationPipe(CreateContractSchema))
    body: CreateContractDto,
  ) {
    const createRes = await this.contractsService.create(body);
    return new SuccessResponse('Contract created successfully', createRes);
  }

  @ApiOperation({ summary: 'Search for contracts ' })
  @ApiQuery({
    name: 'id',
    type: String,
    required: false,
    description: 'Search contract by id',
  })
  @ApiQuery({
    name: 'startDate',
    type: Date,
    required: false,
    description: 'Search contract by start date',
  })
  @ApiQuery({
    name: 'endDate',
    type: Date,
    required: false,
    description: 'Search contract by end date',
  })
  @ApiQuery({
    name: 'status',
    enum: ContractStatus,
    required: false,
    description: 'Search contract by contract status',
  })
  @ApiQuery({
    name: 'contractDate',
    type: Date,
    required: false,
    description: 'Search contract by contract date',
  })
  @ApiQuery({
    name: 'employeeId',
    type: String,
    required: false,
    description: 'Search contract by employee id',
  })
  @ApiQuery({
    name: 'quotationId',
    type: String,
    required: false,
    description: 'Search contract by quotation id',
  })
  @ApiResponse({
    status: 200,
    description: 'Contract found',
    type: Contract,
  })
  @ApiResponse({
    status: 400,
    description: 'Unrecognized key(s) in query',
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to find contract's information",
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | SALES | ACCOUNTANT] can perform this action',
    type: ForbiddenException,

    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, SALES, ACCOUNTANT',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Contract not found',
    type: NotFoundException,
    example: new NotFoundException('Contract not found').getResponse(),
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ValidationError,
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.SALES, RoleEnum.ACCOUNTANT])
  @Get()
  async findContract(
    @Query(new ZodValidationPipe(QueryContractSchema.strict()))
    query: QueryContractDto,
  ) {
    const foundRes = await this.contractsService.find(query);
    return new SuccessResponse('Contract found', foundRes);
  }

  @ApiOperation({ summary: "Update contract's information" })
  @ApiBody({
    type: UpdateContractDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Contract updated',
    type: createResponseType('Contract updated successfully', Contract),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description:
      "Authentication is required to update a contract's information",
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | SALES | ACCOUNTANT] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, SALES, ACCOUNTANT',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided contract information does not exist',
    type: NotFoundException,
    example: new NotFoundException('Contract not found').getResponse(),
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ValidationError,
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.SALES, RoleEnum.ACCOUNTANT])
  @Patch(':id')
  async updateContract(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateContractSchema.partial()))
    body: Partial<CreateContractDto>,
  ) {
    const updateRes = await this.contractsService.update(id, body);
    return new SuccessResponse('Contract updated successfully', updateRes);
  }
}
