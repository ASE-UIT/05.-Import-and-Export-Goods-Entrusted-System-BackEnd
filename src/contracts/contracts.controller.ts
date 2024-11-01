import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  CreateContractDto,
  CreateContractSchema,
  UpdateContractDto,
} from './dtos/CreateContractDto';
import { Contract } from './models/contract.model';
import { ContractsService } from './contracts.service';
import { QueryContractDto, QueryContractSchema } from './dtos/QueryContractDto';
import { FindContractStrategy } from './strategies/find-contract/find-contract-strategy.enum';
import { RoleGuard } from '@/shared/guards/role.guard';
import { ContractStatus } from '@/shared/enums/contract-status.enum';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { Roles } from '@/shared/decorators/role.decorator';

@ApiTags('Contracts')
@Controller({
  path: 'contracts',
  version: '1',
})
export class ContractsController {
  constructor(private contractsService: ContractsService) {}

  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.SALES, RoleEnum.ACCOUTANT])
  @ApiOperation({ summary: 'Create a new contract' })
  @ApiBody({ type: CreateContractDto })
  @ApiCreatedResponse({ description: 'New contract created' })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @Post()
  async createContract(
    @Body(new ZodValidationPipe(CreateContractSchema))
    body: CreateContractDto,
  ): Promise<{ message: string; data: Contract }> {
    const createRes = await this.contractsService.create(body);
    return { message: 'Contract created successfully', data: createRes };
  }

  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.SALES, RoleEnum.ACCOUTANT])
  @ApiOperation({ summary: 'Search for contracts ' })
  @ApiQuery({
    name: 'id',
    type: String,
    required: false,
    description: 'Search contract by id',
  })
  @ApiQuery({
    name: 'start date',
    type: Date,
    required: false,
    description: 'Search contract by start date',
  })
  @ApiQuery({
    name: 'end date',
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
    name: 'contract date',
    type: Date,
    required: false,
    description: 'Search contract by contract date',
  })
  @ApiQuery({
    name: 'employee id',
    type: String,
    required: false,
    description: 'Search contract by employee id',
  })
  @ApiQuery({
    name: 'quotation id',
    type: String,
    required: false,
    description: 'Search contract by quotation id',
  })
  @ApiOkResponse({ description: 'contract found' })
  @ApiNotFoundResponse({ description: 'contract not found' })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @Get()
  async findContract(
    @Query(new ZodValidationPipe(QueryContractSchema))
    query: QueryContractDto,
  ): Promise<Contract[]> {
    if (Object.keys(query).length === 0) {
      return this.contractsService.find(FindContractStrategy.ALL, '');
    }
    const queryFields: { [key: string]: FindContractStrategy } = {
      id: FindContractStrategy.ID,
      startDate: FindContractStrategy.START_DATE,
      endDate: FindContractStrategy.END_DATE,
      status: FindContractStrategy.STATUS,
      contractDate: FindContractStrategy.CONTRACT_DATE,
      employeeId: FindContractStrategy.EMPLOYEE_ID,
      quotationId: FindContractStrategy.QUOTATION_ID,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryContractDto];
      if (value) {
        const contract = await this.contractsService.find(strategy, value);

        if (contract.length > 0) {
          if (strategy === FindContractStrategy.ALL || contract.length > 1)
            return contract;
          else return [contract[0]];
        }
      }
    }

    throw new NotFoundException('Contract not found');
  }

  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.SALES, RoleEnum.ACCOUTANT])
  @ApiOperation({ summary: "Update contract's information" })
  @ApiOkResponse({ description: 'New information updated' })
  @ApiBadRequestResponse({ description: 'Empty body or misspelled property' })
  @ApiNotFoundResponse({ description: 'Could not find contract to update' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @ApiBody({
    type: UpdateContractDto,
    examples: {
      example: {
        description: 'Able to update one or more fields in CreateContractDto',
        value: {
          startDate: '2024-1-1',
          status: 'PENDING',
          endDate: '2024-1-30',
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @Patch(':id')
  async updateContract(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateContractSchema.partial()))
    body: Partial<CreateContractDto>,
  ): Promise<{ message: string; data: Contract }> {
    const updateRes = await this.contractsService.update(id, body);
    return { message: 'Contract updated successfully', data: updateRes };
  }
}
