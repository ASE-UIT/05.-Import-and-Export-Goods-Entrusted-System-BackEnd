import { PaginationResponse } from './paginantion-response.dto';

export interface PaginatedResponse<T> {
  pagination: PaginationResponse;
  results: T[];
}
