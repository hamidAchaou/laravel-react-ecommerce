// src/pages/admin/Products/ProductDetails.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Stack,
  Chip,
  Avatar,
  Button,
  CircularProgress,
  Divider,
  Paper,
} from "@mui/material";
import { fetchProducts, deleteProduct } from "../../../features/products/productsThunks";
import DeleteConfirmationModal from "../../../components/admin/common/DeleteConfirmationModal";

/**
 * Product Details Page - Admin
 * Features:
 * - View product details (images, category, price, description)
 * - Edit / Delete product
 * - Clean UI/UX & optimized performance
 * - SEO friendly (use h1, structured content)
 */
export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: products, loading } = useSelector((state) => state.products);

  const [product, setProduct] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // ✅ Fetch products if not already loaded
  useEffect(() => {
    if (!products.length) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  // ✅ Set current product once products are loaded
  useEffect(() => {
    const found = products.find((p) => p.id === parseInt(id));
    if (found) setProduct(found);
  }, [id, products]);

  // ✅ Handlers
  const handleEdit = useCallback(() => {
    navigate(`/admin/products/edit/${id}`);
  }, [navigate, id]);

  const handleDelete = useCallback(() => {
    setDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    await dispatch(deleteProduct(product.id));
    setDeleteOpen(false);
    navigate("/admin/products");
  }, [dispatch, navigate, product]);

  if (loading || !product)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={6}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700} component="h1">
          Product Details
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="primary" onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Stack>
      </Stack>

      {/* Main Details */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={3} direction={{ xs: "column", md: "row" }}>
          {/* Images */}
          <Stack direction="row" spacing={1}>
            {product.images?.length ? (
              product.images.map((img, idx) => (
                <Avatar
                  key={idx}
                  src={img.image_path}
                  variant="rounded"
                  sx={{ width: 120, height: 120 }}
                />
              ))
            ) : (
              <Avatar
                src="/placeholder.png"
                variant="rounded"
                sx={{ width: 120, height: 120 }}
              />
            )}
          </Stack>

          {/* Info */}
          <Stack spacing={1} flex={1}>
            <Typography variant="h5" fontWeight={600}>
              {product.title || "Untitled Product"}
            </Typography>

            <Typography variant="body1" color="text.secondary">
              {product.description || "No description available."}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" mt={1}>
              <Chip
                label={product.category?.name || "Uncategorized"}
                color="primary"
                sx={{ textTransform: "capitalize" }}
              />
              <Typography variant="h6" fontWeight={500}>
                {product.price ? `${product.price} MAD` : "Price not set"}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} mt={1}>
              <Typography variant="caption" color="text.secondary">
                Created At: {new Date(product.created_at).toLocaleString("fr-FR")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Updated At: {new Date(product.updated_at).toLocaleString("fr-FR")}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      {/* Optional Extra Info */}
      {product.extra_info && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={1}>
            Extra Information
          </Typography>
          <Typography variant="body2">{product.extra_info}</Typography>
        </Paper>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmationModal
        open={deleteOpen}
        handleClose={() => setDeleteOpen(false)}
        handleDeleteConfirm={confirmDelete}
      />
    </Box>
  );
}
