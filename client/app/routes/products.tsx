import type { Route } from "../+types/root";
import { Typography } from "@mui/material";
import axios from "axios";
import { Card, CardContent, CardMedia, Grid } from "@mui/material";
import { useLoaderData } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const cookie = request.headers.get("cookie") ?? "";

    const { data } = await axios.get("http://localhost:3000/api/products", {
      withCredentials: true,
      headers: {
        cookie,
      },
    });

    return data.data;
  } catch (error: any) {
    return { products: [] };
  }
}

export default function ProductsPage() {
  const data: any = useLoaderData();

  const products = data?.products || [];

  return (
    <Grid container spacing={4}>
      {products.map((item: any) => {
        const product = item.node;
        const image = product?.featuredMedia?.preview?.image?.url;

        return (
          <Grid size={3} key={product.id}>
            <Card>
              {image && <CardMedia component="img" height="200" image={image} alt={product.title} />}

              <CardContent>
                <Typography variant="h6">{product.title}</Typography>

                <Typography variant="body2" color="text.secondary">
                  ID: {product.id}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
