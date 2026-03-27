import type { ShopifyClientInterface } from "../interfaces/shopify.client.interface.js";
import type { ShopifyProductRepositoryInterface } from "../interfaces/shopify.product.repository.interface.js";
import { GET_PRODUCTS } from "../queries/product.queries.js";

export class ShopifyProductRepository implements ShopifyProductRepositoryInterface {
  constructor(private readonly client: ShopifyClientInterface) {}

  async getProducts(): Promise<any> {
    const { data, errors } = await this.client.request(GET_PRODUCTS, {
      variables: {
        first: 10,
      },
    });

    if (errors) {
      throw new Error(`Shopify Query Error: ${JSON.stringify(errors)}`);
    }

    return data?.products?.edges;
  }
}
