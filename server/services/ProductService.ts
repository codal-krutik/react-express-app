import type { ShopifyProductRepositoryInterface } from "../shopify/interfaces/shopify.product.repository.interface.js";
import type { ProductServiceInterface } from "../interfaces/service/ProductServiceInterface.js";

export class ProductService implements ProductServiceInterface {
  constructor(private shopifyProductRepository: ShopifyProductRepositoryInterface) {}

  getProducts = async () => {
    try {
      return await this.shopifyProductRepository.getProducts();
    } catch (error) {
      throw error;
    }
  }
}
