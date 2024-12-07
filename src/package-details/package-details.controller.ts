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
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PackageDetailsService } from './package-details.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import {
  CreatePackageDetailDto,
  CreatePackageDetailSchema,
  UpdatePackageDetailDto,
} from './dtos/CreatePackageDetailDto';
import {
  QueryPackageDetailDto,
  QueryPackageDetailSchema,
} from './dtos/QueryPackageDetailDto';
import { FindPackageDetailStrategy } from './strategies/find-packageDetail/find-packageDetail-strategy.enum';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleGuard } from '@/shared/guards/role.guard';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { PackageDetail, PackageType } from './models/packageDetails.model';
import { createResponseType } from '@/shared/helpers/create-response.mixin';
import { use } from 'passport';

@ApiTags('package details')
@Controller({
  path: 'package-details',
  version: '1',
})
export class PackageDetailsController {
  constructor(private packageDetailsService: PackageDetailsService) {}

  //query package detail
  @ApiOperation({
    summary: 'Retrieve package detail based on query parameters',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved quote requests',
    example: [
      {
        id: '10546188-89f8-4588-a1d9-59df2ea9082f',
        packageType: 'FREEZE',
        weight: 4.5,
        length: 2.7,
        width: 100,
        height: 7,
        detailId: 'd65e47fe-c494-41c1-b1aa-72561da2e8e2',
        createdAt: '2024-10-31T07:25:22.958Z',
        updatedAt: '2024-10-31T07:26:11.854Z',
      },
    ],
  })
  @ApiResponse({
    status: 401,
    description: 'Not logged in or account has unappropriate role',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'No package detail found',
    type: NotFoundException,
    example: new NotFoundException('No package detail found').getResponse(),
  })
  @ApiQuery({ name: 'packageType', required: false, enum: PackageType })
  @ApiQuery({ name: 'detailId', required: false, type: String })
  @UseGuards(RoleGuard)
  @Get()
  async getQuoteReqDetail(
    @Query(new ZodValidationPipe(QueryPackageDetailSchema))
    query: QueryPackageDetailDto,
  ) {
    const packageDetail =
      await this.packageDetailsService.findPackageDetail(query);
    return packageDetail;
  }

  @ApiOperation({
    summary: 'Retrieve package detail by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved quote requests',
    example: {
      id: '10546188-89f8-4588-a1d9-59df2ea9082f',
      packageType: 'FREEZE',
      weight: 4.5,
      length: 2.7,
      width: 100,
      height: 7,
      detailId: 'd65e47fe-c494-41c1-b1aa-72561da2e8e2',
      createdAt: '2024-10-31T07:25:22.958Z',
      updatedAt: '2024-10-31T07:26:11.854Z',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Not logged in or account has unappropriate role',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'No package detail found',
    type: NotFoundException,
    example: new NotFoundException('No package detail found').getResponse(),
  })
  @UseGuards(RoleGuard)
  @Get(':id')
  async getPackageDetailById(@Param('id') id: string) {
    const packageDetail =
      await this.packageDetailsService.findPackageDetailById(id);
    return packageDetail;
  }

  //create package detail
  @ApiOperation({ summary: 'Create a new package detail' })
  @ApiResponse({
    status: 201,
    description: 'Package detail successfully created',
    type: createResponseType(
      'Package detail successfully created',
      PackageDetail,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid foreign key',
    type: BadRequestException,
    example: new BadRequestException('Invalid foreign key').getResponse(),
  })
  @ApiResponse({
    status: 401,
    description: 'Only authenticated users can access this resource',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description: 'Only the following roles can create users',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN,SALES,MANAGER',
    ).getResponse(),
  })
  @ApiBody({
    type: CreatePackageDetailDto,
    schema: {
      example: {
        packageType: 'DRY',
        weight: 10,
        length: 10,
        width: 10,
        height: 10,
        detailId: 'b1c27e61-77f1-4d5a-a10d-a28a5c8b1ce1',
      },
    },
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.SALES, RoleEnum.MANAGER])
  @Post()
  async createPackageDetail(
    @Body(new ZodValidationPipe(CreatePackageDetailSchema))
    body: CreatePackageDetailDto,
  ) {
    const packageDetail =
      await this.packageDetailsService.createPackageDetail(body);
    return { message: 'Package Detail Created', data: packageDetail };
  }

  //update package detail
  @ApiOperation({ summary: 'Update a package detail' })
  @ApiResponse({
    status: 200,
    description: 'Package detail successfully updated',
    type: createResponseType(
      'Package detail successfully updated',
      PackageDetail,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid foreign key.',
    type: BadRequestException,
    example: new BadRequestException('Invalid foreign key').getResponse(),
  })
  @ApiResponse({
    status: 401,
    description: 'Only authenticated users can access this resource',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description: 'Only the following roles can create users',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN,SALES,MANAGER',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Package detail id does not exists in database',
    type: NotFoundException,
    example: new NotFoundException(
      'Package detail id does not exists in database',
    ).getResponse(),
  })
  @ApiBody({
    type: UpdatePackageDetailDto,
    schema: {
      example: {
        packageType: 'DRY',
        weight: 10,
        length: 10,
        width: 10,
        height: 10,
        detailId: 'b1c27e61-77f1-4d5a-a10d-a28a5c8b1ce1',
      },
    },
  })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN, RoleEnum.SALES, RoleEnum.MANAGER])
  @Patch(':id')
  async updatePackageDetail(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreatePackageDetailSchema.partial()))
    body: Partial<CreatePackageDetailDto>,
  ) {
    //check if body is empty
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Body cannot be empty');
    }
    const packageDetail = await this.packageDetailsService.updatePackageDetail(
      id,
      body,
    );
    return {
      message: 'Package Detail updated successfully',
      data: packageDetail,
    };
  }
}
