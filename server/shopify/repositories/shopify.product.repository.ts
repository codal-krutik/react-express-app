import type { PaginatedProductsResult, PaginationParams } from "../../dtos/ProductDTO.js";
import type { ShopifyClientInterface } from "../interfaces/shopify.client.interface.js";
import type { ShopifyProductRepositoryInterface } from "../interfaces/shopify.product.repository.interface.js";
import { GET_PRODUCTS } from "../queries/product.queries.js";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 250;

export class ShopifyProductRepository implements ShopifyProductRepositoryInterface {
  constructor(private readonly client: ShopifyClientInterface) {}

  async getProducts(params: PaginationParams): Promise<PaginatedProductsResult> {
    let first: number | null = null;
    let last: number | null = null;
    let after: string | null = null;
    let before: string | null = null;

    const clamp = (value: number) => Math.max(1, Math.min(value, MAX_PAGE_SIZE));

    if ("first" in params) {
      first = clamp(params.first ?? DEFAULT_PAGE_SIZE);
      after = params.after ?? null;
    }

    if ("last" in params) {
      last = clamp(params.last ?? DEFAULT_PAGE_SIZE);
      before = params.before ?? null;
    }

    if ((first && last) || (after && before)) {
      throw new Error("Use either forward (first + after) OR backward (last + before) pagination.");
    }

    const { data, errors } = await this.client.request(GET_PRODUCTS, {
      variables: {
        first,
        after,
        last,
        before,
      },
    });

    if (errors) {
      throw new Error(`Shopify Query Error: ${JSON.stringify(errors)}`);
    }

    const productsConnection = data?.products;

    if (!productsConnection) {
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      };
    }

    return {
      edges: productsConnection.edges,
      pageInfo: productsConnection.pageInfo,
    };
  }
}
