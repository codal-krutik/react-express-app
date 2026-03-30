export interface PaginatedProductsResult {
  edges: Array<{
    cursor: string;
    node: {
      id: string;
      title: string;
      featuredImage?: {
        url: string;
        altText?: string | null;
      } | null;
    };
  }>;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string | null;
    endCursor?: string | null;
  };
}

export type PaginationParams =
  | {
      first: number;
      after?: string | null;
      last?: never;
      before?: never;
    }
  | {
      last: number;
      before?: string | null;
      first?: never;
      after?: never;
    };
