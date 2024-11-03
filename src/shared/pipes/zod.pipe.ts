import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';
import {
  ValidationError,
  ValidationErrorDetail,
} from '../classes/validation-error.class';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(
          (err) => new ValidationErrorDetail(err.path.join('.'), err.message),
        );
        throw new BadRequestException(new ValidationError(errorMessages));
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
