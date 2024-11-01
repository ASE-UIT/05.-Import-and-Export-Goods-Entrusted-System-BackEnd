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
  UseGuards,
} from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { FindProviderStrategy } from './strategies/find-provider/find-provider-strategy.enum';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { QueryProviderDto, QueryProviderSchema } from './dtos/QueryProviderDto';
import {
  CreateProviderDto,
  CreateProviderSchema,
  UpdateProviderDto,
} from './dtos/CreateProviderDto';
import { RoleGuard } from '@/shared/guards/role.guard';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';
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
  PartialType,
} from '@nestjs/swagger';
import { ProviderStatus } from './models/provider.model';

@ApiTags('Providers')
@Controller({
  path: 'providers',
  version: '1',
})
export class ProvidersController {
  constructor(private providerService: ProvidersService) {}

  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.CUSTOMER_SERVICE,
  //   RoleEnum.MANAGER,
  // ])
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
    description: 'Search provider by contact representative',
  })
  @ApiQuery({
    name: 'status',
    enum: ProviderStatus,
    required: false,
    description: 'Search provider by status',
  })
  @ApiOkResponse({ description: 'Provider found' })
  @ApiNotFoundResponse({ description: 'Provider not found' })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })

  @Get()
  async getProviders(
    @Query(new ZodValidationPipe(QueryProviderSchema)) query: QueryProviderDto,
  ) {
    if (Object.keys(query).length === 0)
      return await this.providerService.findProvider(
        FindProviderStrategy.ALL,
        '',
      );
    const queryFields: { [key: string]: FindProviderStrategy } = {
      name: FindProviderStrategy.NAME,
      phone: FindProviderStrategy.PHONE,
      email: FindProviderStrategy.EMAIL,
      address: FindProviderStrategy.ADDRESS,
      country: FindProviderStrategy.COUNTRY,
      status: FindProviderStrategy.STATUS,
      contactRepId: FindProviderStrategy.CONTACT_REP_ID,
    };

    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryProviderDto];
      if (value) {
        const provider = await this.providerService.findProvider(strategy, value);
        if (provider.length > 0) {
          if (strategy === FindProviderStrategy.ALL || provider.length > 1)
            return provider;
          else return provider[0];
        }
      }
    }

    throw new NotFoundException('Provider not found');
  }

  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.CUSTOMER_SERVICE,
  //   RoleEnum.MANAGER,
  // ])
  @ApiOperation({ summary: 'Create new provider' })
  @ApiBody({
    type: CreateProviderDto,
  })
  @ApiCreatedResponse({ description: 'New provider created' })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiConflictResponse({ description: 'Unique information already exist' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @ApiBody({
    type: CreateProviderDto,
    examples: {
      example: {
        description: 'Create a new provider with basic details',
        value: {
          name: 'New Provider',
          phone: '987654321',
          email: 'newprovider@example.com',
          address: '123 Main St',
          country: 'Vietnam',
          contactRepId: '123e4567-e89b-12d3-a456-426614174000',
          status: ProviderStatus.ACTIVE,
        },
      },
    },
  })
  @Post()
  async createProvider(
    @Body(new ZodValidationPipe(CreateProviderSchema)) body: CreateProviderDto,
  ) {
    const createRes = await this.providerService.createProvider(body);
    return { message: `Provider created`, data: createRes };
  }

  // @UseGuards(RoleGuard)
  // @Roles([
  //   RoleEnum.ADMIN,
  //   RoleEnum.SALES,
  //   RoleEnum.CUSTOMER_SERVICE,
  //   RoleEnum.MANAGER,
  // ])
  @ApiOperation({ summary: "Update provider's information" })
  @ApiOkResponse({ description: 'New information updated' })
  @ApiBadRequestResponse({ description: 'Empty body or misspelled property' })
  @ApiNotFoundResponse({ description: 'Could not find provider to update' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @ApiBody({
    type: UpdateProviderDto,
    examples: {
      example: {
        description: 'Able to update one or more fields',
        value: {
          name: 'Updated Provider Name',
          phone: '111222333',
          email: 'updatedprovider@example.com',
          address: 'Updated Address 123',
          country: 'Vietnam',
          contactRepId: '123e4567-e89b-12d3-a456-426614174001',
          status: ProviderStatus.ACTIVE,
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })

  @Patch(':id')
  async updateProvider(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateProviderSchema.partial())) 
    body: Partial<CreateProviderDto>,
  ) {
    if (Object.keys(body).length === 0)
      throw new BadRequestException('Body is empty');
    const updateResponse = await this.providerService.updateProvider(id, body);
    return updateResponse;
  }
}
