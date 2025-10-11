import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Stack,
  Chip,
  Button,
  CircularProgress,
  Paper,
  Grid,
  useTheme,
} from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { fetchProducts, deleteProduct } from "../../../features/products/productsThunks";
import DeleteConfirmationModal from "../../../components/admin/common/DeleteConfirmationModal";
import StatCard from "../../../components/admin/common/StatCard";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { items: products, loading } = useSelector((state) => state.products);
  const [product, setProduct] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  /** 🔁 Fetch products only once if not loaded */
  useEffect(() => {
    if (!products.length) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  /** 🎯 Set product by ID */
  useEffect(() => {
    const found = products.find((p) => p.id === Number(id));
    if (found) {
      setProduct(found);
      setSelectedImage(found.images?.[0]?.image_path || null); // set first image as default
    }
  }, [id, products]);

  /** ✏️ Edit product handler */
  const handleEdit = useCallback(() => navigate(`/admin/products/edit/${id}`), [navigate, id]);

  /** ❌ Delete product handlers */
  const handleDelete = useCallback(() => setDeleteOpen(true), []);
  const confirmDelete = useCallback(async () => {
    if (!product) return;
    await dispatch(deleteProduct(product.id));
    setDeleteOpen(false);
    navigate("/admin/products");
  }, [dispatch, navigate, product]);

  /** 🧮 Memoized stock status */
  const inventoryStatus = useMemo(() => {
    if (!product) return { label: "", color: "default" };
    const qty = product.stock || 0;
    if (qty === 0) return { label: "Out of Stock", color: "error" };
    if (qty < 10) return { label: "Low Stock", color: "warning" };
    return { label: "In Stock", color: "success" };
  }, [product]);

  /** ⏳ Loading state */
  if (loading || !product)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );

  return (
    <Box component="section" sx={{ p: 3 }}>
      {/* 🧭 Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h4" fontWeight={700} component="h1" color="text.primary">
          {product.title || "Untitled Product"}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Stack>
      </Stack>

      {/* 🧩 Layout */}
      <Grid container spacing={3}>
        {/* LEFT COLUMN */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }} elevation={3}>
            {/* 🖼️ Product Media */}
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Media
            </Typography>

            {/* Main image */}
            <Box
              component="img"
              src={selectedImage || product.images?.[0]?.image_path || ""}
              alt={product.title || "Product"}
              sx={{
                width: "100%",
                height: 250,
                borderRadius: 3,
                objectFit: "cover",
                mb: 2,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: 2,
                backgroundColor: theme.palette.action.hover,
              }}
              loading="lazy"
            />

            {/* Thumbnails */}
            <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="flex-start">
              {product.images?.length ? (
                product.images.map((img, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={img.image_path}
                    alt={`${product.title} - ${idx + 1}`}
                    onClick={() => setSelectedImage(img.image_path)}
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: 2,
                      objectFit: "cover",
                      border:
                        selectedImage === img.image_path
                          ? `2px solid ${theme.palette.primary.main}`
                          : `1px solid ${theme.palette.divider}`,
                      boxShadow: selectedImage === img.image_path ? 3 : 1,
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: 4,
                      },
                    }}
                    loading="lazy"
                  />
                ))
              ) : (
                <Box
                  sx={{
                    width: 150,
                    height: 150,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: theme.palette.action.hover,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    No Image
                  </Typography>
                </Box>
              )}
            </Stack>

            {/* 📄 Description */}
            <Typography variant="h6" fontWeight={600} mt={4} gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" color="text.primary" sx={{ whiteSpace: "pre-wrap" }}>
              {product.description || "No description available."}
            </Typography>

            {/* 📝 Extra Info */}
            {product.extra_info && (
              <Box mt={4} pt={2} borderTop={`1px dashed ${theme.palette.divider}`}>
                <Typography variant="h6" fontWeight={600} mb={1}>
                  Additional Notes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.extra_info}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid item xs={12} md={4}>
          <StatCard
            icon={Inventory2Icon}
            title="Stock Quantity"
            value={product.stock || 0}
            color={inventoryStatus.color}
            subtitle={inventoryStatus.label}
            sx={{ mb: 3 }}
          />

          {/* 💰 Price & Category */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }} elevation={2}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Pricing & Classification
            </Typography>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Price (MAD)</Typography>
                <Typography fontWeight={600}>{product.price ?? "N/A"}</Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Category</Typography>
                <Chip
                  label={product.category?.name || "Uncategorized"}
                  color="primary"
                  size="small"
                  sx={{ textTransform: "capitalize", fontWeight: 600 }}
                />
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">SKU / ID</Typography>
                <Typography color="text.primary">{product.id}</Typography>
              </Stack>
            </Stack>
          </Paper>

          {/* ⏰ Timestamps */}
          <Paper sx={{ p: 3, borderRadius: 3 }} elevation={2}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Timestamps
            </Typography>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <ScheduleIcon fontSize="small" color="secondary" />
                <Typography variant="body2" color="text.secondary">
                  Created:
                </Typography>
                <Typography variant="body2">
                  {new Date(product.created_at).toLocaleString("fr-FR")}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <ScheduleIcon fontSize="small" color="secondary" />
                <Typography variant="body2" color="text.secondary">
                  Updated:
                </Typography>
                <Typography variant="body2">
                  {new Date(product.updated_at).toLocaleString("fr-FR")}
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* 🗑️ Delete Modal */}
      <DeleteConfirmationModal
        open={deleteOpen}
        handleClose={() => setDeleteOpen(false)}
        handleDeleteConfirm={confirmDelete}
      />
    </Box>
  );
}
