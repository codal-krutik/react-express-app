import type { PaginatedProductsResult, PaginationParams } from "../../dtos/ProductDTO.js";

export interface ShopifyProductRepositoryInterface {
  getProducts(params: PaginationParams): Promise<PaginatedProductsResult>;
}
