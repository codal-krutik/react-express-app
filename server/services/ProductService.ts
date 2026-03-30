import type { ShopifyProductRepositoryInterface } from "../shopify/interfaces/shopify.product.repository.interface.js";
import type { ProductServiceInterface } from "../interfaces/service/ProductServiceInterface.js";
import type { PaginationParams, PaginatedProductsResult } from "../dtos/ProductDTO.js";

export class ProductService implements ProductServiceInterface {
  constructor(private shopifyProductRepository: ShopifyProductRepositoryInterface) {}

  getProducts = async (params: PaginationParams): Promise<PaginatedProductsResult> => {
    try {
      return await this.shopifyProductRepository.getProducts(params);
    } catch (error) {
      throw error;
    }
  };
}
