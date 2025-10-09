// src/pages/admin/Products.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../../features/products/productsThunks";

import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Chip,
} from "@mui/material";

export default function Products() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts()).then((res) =>
      console.log("🟢 Fetched products thunk result:", res)
    );
  }, [dispatch]);

  if (loading)
    return (
      <Typography variant="h6" align="center" mt={4}>
        Loading products...
      </Typography>
    );

  if (error)
    return (
      <Typography variant="h6" align="center" color="error" mt={4}>
        {error}
      </Typography>
    );

  if (items.length === 0)
    return (
      <Typography variant="h6" align="center" mt={4}>
        No products found.
      </Typography>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      <Grid container spacing={3}>
        {items.map((p) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              {p.images && p.images.length > 0 && (
                <CardMedia
                  component="img"
                  height="180"
                  image={p.images[0].image_path}
                  alt={p.images[0].alt_text || "Product Image"}
                />
              )}

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {p.title ?? "(No title)"}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {p.description ?? "No description"}
                </Typography>

                {p.category && (
                  <Stack direction="row" spacing={1} mt={1} mb={1}>
                    <Chip label={p.category.name} color="primary" size="small" />
                    <Typography variant="caption">
                      Type: {p.category.type} | ID: {p.category.id}
                    </Typography>
                  </Stack>
                )}

                {p.images && p.images.length > 0 && (
                  <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                    {p.images.map((img) => (
                      <Box key={img.id} textAlign="center">
                        <CardMedia
                          component="img"
                          image={img.image_path}
                          alt={img.alt_text}
                          sx={{ width: 100, height: 100, borderRadius: 1, objectFit: "cover" }}
                        />
                        <Typography variant="caption" display="block" mt={0.5}>
                          {img.is_primary ? "⭐ Primary" : "Secondary"}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}

                <Typography variant="caption" color="text.secondary" mt={1} display="block">
                  Price: {p.price} MAD
                </Typography>

                <Typography variant="caption" color="text.secondary" mt={1} display="block">
                  Created at: {p.created_at} <br />
                  Updated at: {p.updated_at}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
