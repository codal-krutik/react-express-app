import type { PaginationParams } from "../../dtos/ProductDTO.js";
import type { PaginatedProductsResult } from "../../dtos/ProductDTO.js";

export interface ProductServiceInterface {
  getProducts(params: PaginationParams): Promise<PaginatedProductsResult>;
}
