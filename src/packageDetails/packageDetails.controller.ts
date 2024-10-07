import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { PackageDetailsService } from './packageDetails.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { CreatePackageDetailDto, CreatePackageDetailSchema } from './dtos/CreatePackageDetailDto';
import { UpdatePackageDetailDto, UpdatePackageDetailSchema } from './dtos/UpdatePackageDetailDto';
import { QueryPackageDetailDto, QueryPackageDetailSchema } from './dtos/QueryPackageDetailDto';
import { FindPackageDetailStrategy } from './strategies/find-packageDetail/find-packageDetail-strategy.enum';

@Controller({
    path: 'packageDetails',
    version: '1',
})
export class PackageDetailsController {
    constructor(
        private packageDetailsService: PackageDetailsService
    ) { }

    @Get()
    async getQuoteReqDetail(
        @Query(new ZodValidationPipe(QueryPackageDetailSchema)) query: QueryPackageDetailDto
    ) {
        const queryFields: { [key: string]: FindPackageDetailStrategy } = {
            all: FindPackageDetailStrategy.ALL,
            detailId: FindPackageDetailStrategy.DETAILID,
            packageType: FindPackageDetailStrategy.PACKAGETYPE
        }

        // Assign corrisponding strategy to query fields
        for (const [key, strategy] of Object.entries(queryFields)) {
            const value = query[key as keyof QueryPackageDetailDto];
            if (value) {
                const packageDetail = await this.packageDetailsService.findPackageDetail(
                    strategy,
                    value,
                );
                if (packageDetail.length > 0) {
                    if (strategy === FindPackageDetailStrategy.ALL || packageDetail.length > 1)
                        return packageDetail;
                    else return packageDetail[0];
                }
            }
        }
    }

    @Post()
    async createPackageDetail(
        @Body(new ZodValidationPipe(CreatePackageDetailSchema)) body: CreatePackageDetailDto
    ) {
        await this.packageDetailsService.createPackageDetail(body)
        return { message: "Package Detail Created" }
    }

    @Patch(':id')
    async updatePackageDetail(
        @Param('id') id: string, @Body(new ZodValidationPipe(UpdatePackageDetailSchema.partial())) body: Partial<UpdatePackageDetailDto>) {
        await this.packageDetailsService.updatePackageDetail(id, body)
        return { message: 'Package Detail Updated' }
    }
}
