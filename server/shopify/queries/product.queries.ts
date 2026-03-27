export const GET_PRODUCTS = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
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
    }
  }
`;
