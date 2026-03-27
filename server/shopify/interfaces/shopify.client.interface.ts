import type { RequestParams, ClientResponse } from "@shopify/graphql-client";

export interface ShopifyClientInterface {
  request<T>(...params: RequestParams): Promise<ClientResponse<T>>;
}
