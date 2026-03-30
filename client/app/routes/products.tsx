import type { Route } from "../+types/root";
import { Button, MenuItem, Select, Typography } from "@mui/material";
import axios from "axios";
import { Card, CardContent, CardMedia, Grid } from "@mui/material";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import React from "react";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const cookie = request.headers.get("cookie") ?? "";
    const url = new URL(request.url);

    const after = url.searchParams.get("after");
    const before = url.searchParams.get("before");
    const limit = Number(url.searchParams.get("limit")) || 10;

    const params: any = {};

    if (after) {
      params.after = after;
      params.first = limit;
    } else if (before) {
      params.before = before;
      params.last = limit;
    } else {
      params.first = limit;
    }

    const { data } = await axios.get("http://localhost:3000/api/products", {
      withCredentials: true,
      headers: {
        cookie,
      },
      params,
    });

    return data.data;
  } catch (error: any) {
    return {
      products: {
        edges: [],
        pageInfo: {},
      },
    };
  }
}

export default function ProductsPage() {
  const data: any = useLoaderData();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const products = data?.edges || [];
  const pageInfo = data?.pageInfo || {};

  const limit = Number(searchParams.get("limit")) || 10;

  const handleLimitChange = (e: any) => {
    const newLimit = e.target.value;

    setSearchParams({
      limit: String(newLimit),
    });
  };

  const handleNext = () => {
    if (pageInfo?.endCursor) {
      navigate(`?after=${pageInfo.endCursor}&limit=${limit}`);
    }
  };

  const handlePrevious = () => {
    if (pageInfo?.startCursor) {
      navigate(`?before=${pageInfo.startCursor}&limit=${limit}`);
    }
  };

  return (
    <React.Fragment>
      <div style={{ marginTop: "20px" }}>
        <Select value={limit} onChange={handleLimitChange} size="small">
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={30}>30</MenuItem>
        </Select>
      </div>

      <Grid container spacing={4} marginTop={4}>
        {products.map((item: any) => {
          const product = item.node;
          const image = product?.featuredMedia?.preview?.image?.url;

          return (
            <Grid size={3} key={product.id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia component="img" sx={{ height: 140 }} image={image} alt={product.title} />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <Button variant="contained" disabled={!pageInfo?.hasPreviousPage} onClick={handlePrevious}>
          Previous
        </Button>

        <Button variant="contained" disabled={!pageInfo?.hasNextPage} onClick={handleNext}>
          Next
        </Button>
      </div>
    </React.Fragment>
  );
}
