export const GET_PRODUCTS = `
  query GetProducts(
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    products(
      first: $first
      after: $after
      last: $last
      before: $before
    ) {
      edges {
        cursor
        node {
          id
          title
          featuredMedia {
            preview {
              image {
                url
                altText
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;
