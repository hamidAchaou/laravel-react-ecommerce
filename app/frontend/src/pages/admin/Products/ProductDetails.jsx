// src/pages/admin/Products/ProductDetails.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
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
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
} from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import DeleteConfirmationModal from "../../../components/admin/common/DeleteConfirmationModal";
import StatCard from "../../../components/admin/common/StatCard";
import { fetchProducts, deleteProduct } from "../../../features/products/productsThunks";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { items: products, loading } = useSelector((state) => state.products);
  const [product, setProduct] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  /** 🔁 Fetch products only if not loaded */
  useEffect(() => {
    if (!products.length) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  /** 🎯 Set product by ID */
  useEffect(() => {
    const found = products.find((p) => p.id === Number(id));
    if (found) {
      setProduct(found);
      // Ensure selectedImage starts with the first image if available
      setSelectedImage(found.images?.[0]?.image_path || null);
    }
  }, [id, products]);

  /** ✏️ Handlers */
  const handleEdit = useCallback(() => navigate(`/admin/products/edit/${id}`), [navigate, id]);
  const handleDelete = useCallback(() => setDeleteOpen(true), []);
  const confirmDelete = useCallback(async () => {
    if (!product) return;
    await dispatch(deleteProduct(product.id));
    setDeleteOpen(false);
    navigate("/admin/products");
  }, [dispatch, navigate, product]);
  const handleTabChange = (e, value) => setTabIndex(value);

  /** 🧮 Inventory Status */
  const inventoryStatus = useMemo(() => {
    if (!product) return { label: "", color: "default" };
    const qty = product.stock || 0;
    if (qty === 0) return { label: "Out of Stock", color: "error" };
    if (qty < 10) return { label: "Low Stock", color: "warning" };
    return { label: "In Stock", color: "success" };
  }, [product]);

  /** ⏳ Loading */
  if (loading || !product)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );

  return (
    <Box component="section" sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/admin/products" underline="hover" color="inherit">
          Products
        </Link>
        <Typography color="text.primary">{product.title || "Untitled Product"}</Typography>
      </Breadcrumbs>

      {/* Header */}
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

      {/* Grid Layout */}
      <Grid container spacing={3}>
        {/* LEFT: Media & Tabs */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }} elevation={3}>
            {/* Tabs */}
            <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="Media" />
              <Tab label="Description" />
              {product.extra_info && <Tab label="Additional Info" />}
            </Tabs>

            {/* Tab Panels */}
            {tabIndex === 0 && (
              // Start of the new FLEX layout for side-by-side images
              <Stack direction="row" spacing={3} alignItems="flex-start">
                
                {/* 1. THUMBNAILS (Vertical Stack) */}
                <Stack 
                  direction="column" 
                  spacing={1} 
                  sx={{ 
                    width: 120, // Fixed width for the thumbnail column
                    maxHeight: 400, // Match the height of the main image
                    overflowY: 'auto', // Scroll if there are many images
                    pr: 1 // Padding for the scrollbar
                  }}
                >
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
                              ? `3px solid ${theme.palette.primary.main}`
                              : `1px solid ${theme.palette.divider}`,
                          boxShadow: selectedImage === img.image_path ? 3 : 1,
                          cursor: "pointer",
                          transition: "all 0.25s ease",
                          "&:hover": { opacity: 0.9, boxShadow: 4 },
                        }}
                        loading="lazy"
                      />
                    ))
                  ) : (
                    <Box
                      sx={{
                        width: 100, height: 100, display: "flex", 
                        alignItems: "center", justifyContent: "center", 
                        bgcolor: theme.palette.action.hover, borderRadius: 2
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        No Image
                      </Typography>
                    </Box>
                  )}
                </Stack>

                {/* 2. PRIMARY IMAGE (Takes up the rest of the space) */}
                <Box sx={{ flexGrow: 1 }}>
                  <Box
                    component="img"
                    src={selectedImage || product.images?.[0]?.image_path || ""}
                    alt={product.title || "Product"}
                    sx={{
                      width: "100%",
                      height: 400, // Fixed height for a prominent display
                      borderRadius: 3,
                      objectFit: "contain", // Ensures the entire image is visible
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: 2,
                      backgroundColor: theme.palette.action.hover,
                    }}
                    loading="lazy"
                  />
                </Box>
                
              </Stack>
              // End of the new FLEX layout
            )}

            {/* Description Tab - Added padding and border for clearer separation */}
            {tabIndex === 1 && (
              <Box sx={{ p: 2, border: '1px solid', borderColor: theme.palette.divider, borderRadius: 2 }}>
                <Typography variant="body1" color="text.primary" sx={{ whiteSpace: "pre-wrap" }}>
                  {product.description || "No description available."}
                </Typography>
              </Box>
            )}

            {tabIndex === 2 && product.extra_info && (
              <Typography variant="body2" color="text.secondary">
                {product.extra_info}
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* RIGHT: Stats, Price, Timestamps */}
        <Grid item xs={12} md={4}>
          <StatCard
            icon={Inventory2Icon}
            title="Stock Quantity"
            value={product.stock || 0}
            color={inventoryStatus.color}
            subtitle={inventoryStatus.label}
            sx={{ mb: 3 }}
          />

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

      {/* Delete Modal */}
      <DeleteConfirmationModal
        open={deleteOpen}
        handleClose={() => setDeleteOpen(false)}
        handleDeleteConfirm={confirmDelete}
      />
    </Box>
  );
}