export interface PaginationResponse {
  currentPage: number;
  records: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
}
