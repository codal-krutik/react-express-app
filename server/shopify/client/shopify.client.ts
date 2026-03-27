import { createGraphQLClient } from "@shopify/graphql-client";
import type { ShopifyClientInterface } from "../interfaces/shopify.client.interface.js";
import type { ClientResponse, RequestParams } from "@shopify/graphql-client";

interface ShopifyClientConfig {
  storeDomain: string;
  apiVersion: string;
  accessToken: string;
};

export class ShopifyClient implements ShopifyClientInterface {
  private client;

  constructor(config: ShopifyClientConfig) {
    this.client = createGraphQLClient({
      url: `https://${config.storeDomain}/admin/api/${config.apiVersion}/graphql.json`,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": config.accessToken,
      },
      retries: 2,
    });
  }

  async request<T>(...params: RequestParams): Promise<ClientResponse<T>> {
    const response = await this.client.request<T>(...params);

    if (response.errors) {
      throw new Error(`Shopify Error: ${JSON.stringify(response.errors)}`);
    }

    return response;
  }
}
