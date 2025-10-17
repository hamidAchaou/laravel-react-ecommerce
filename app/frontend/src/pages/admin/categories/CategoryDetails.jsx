// src/pages/admin/Categories/CategoryDetails.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  Button,
  CircularProgress,
  Breadcrumbs,
  Link,
  useTheme,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  Skeleton,
} from "@mui/material";
import {
  EditRounded,
  ArrowBackRounded,
  CategoryRounded,
  CalendarTodayRounded,
  UpdateRounded,
  ImageRounded,
  FolderOpenRounded,
} from "@mui/icons-material";
import { fetchCategories } from "../../../features/categories/categoriesThunks";

export default function CategoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { items: categories, loading, error } = useSelector((state) => state.categories);
  const [category, setCategory] = useState(null);

  // 🔹 Fetch categories if not loaded
  useEffect(() => {
    if (!categories.length) dispatch(fetchCategories());
  }, [dispatch, categories.length]);

  // 🔹 Find the category by ID
  useEffect(() => {
    const found = categories.find((c) => c.id === Number(id));
    if (found) setCategory(found);
  }, [id, categories]);

  // 🔹 Memoize formatted dates
  const formattedDates = useMemo(() => ({
    createdAt: category?.created_at ? new Date(category.created_at).toLocaleString() : "—",
    updatedAt: category?.updated_at ? new Date(category.updated_at).toLocaleString() : "—",
    dateDiff: category?.created_at && category?.updated_at 
      ? `Updated ${Math.floor((new Date(category.updated_at) - new Date(category.created_at)) / (1000 * 60 * 60 * 24))} days after creation`
      : null
  }), [category]);

  const getTypeColor = (type) => {
    const colors = {
      product: "primary",
      service: "success",
      blog: "warning",
      default: "default"
    };
    return colors[type] || colors.default;
  };

  if (loading && !category) {
    return (
      <Box component="main" sx={{ p: { xs: 2, md: 3 } }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box component="main" sx={{ p: { xs: 2, md: 3 } }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load category: {error}
        </Alert>
        <Button
          startIcon={<ArrowBackRounded />}
          onClick={() => navigate("/admin/categories")}
          variant="outlined"
        >
          Back to Categories
        </Button>
      </Box>
    );
  }

  if (!category) {
    return (
      <Box component="main" sx={{ p: { xs: 2, md: 3 } }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Category not found
        </Alert>
        <Button
          startIcon={<ArrowBackRounded />}
          onClick={() => navigate("/admin/categories")}
          variant="outlined"
        >
          Back to Categories
        </Button>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }} separator="›">
          <Link 
            component={RouterLink} 
            to="/admin" 
            underline="hover" 
            color="inherit"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <FolderOpenRounded fontSize="small" />
            Dashboard
          </Link>
          <Link 
            component={RouterLink} 
            to="/admin/categories" 
            underline="hover" 
            color="inherit"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <CategoryRounded fontSize="small" />
            Categories
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {category.name}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 56,
                height: 56,
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              <CategoryRounded />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700} color={theme.palette.text.primary}>
                {category.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                Category Details & Information
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Back to Categories">
              <IconButton 
                onClick={() => navigate("/admin/categories")}
                sx={{ 
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2
                }}
              >
                <ArrowBackRounded />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditRounded />}
              onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
              sx={{ 
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Edit Category
            </Button>
          </Stack>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Information Card */}
        <Grid item xs={12} lg={8}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CategoryRounded color="primary" />
              Category Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    CATEGORY TYPE
                  </Typography>
                  <Chip
                    label={category.type ? category.type.charAt(0).toUpperCase() + category.type.slice(1) : "Not specified"}
                    color={getTypeColor(category.type)}
                    variant="filled"
                    sx={{ 
                      borderRadius: 1.5,
                      fontWeight: 600,
                      width: 'fit-content'
                    }}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    PARENT CATEGORY
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: category.parent_name ? 'text.primary' : 'text.secondary'
                  }}>
                    <FolderOpenRounded fontSize="small" />
                    {category.parent_name || "No parent category"}
                  </Typography>
                </Stack>
              </Grid>

              {category.description && (
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      DESCRIPTION
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {category.description}
                    </Typography>
                  </Stack>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Image Section - FIXED: Use image_url instead of image */}
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              mt: 3,
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ImageRounded color="primary" />
              Category Image
            </Typography>

            {category.image_url ? ( // Changed from category.image to category.image_url
              <Box
                component="img"
                src={category.image_url} // Changed from category.image to category.image_url
                alt={category.name}
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  height: 250,
                  borderRadius: 2,
                  objectFit: 'cover',
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  }
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  height: 250,
                  borderRadius: 2,
                  bgcolor: theme.palette.action.hover,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.palette.text.secondary,
                  border: `2px dashed ${theme.palette.divider}`
                }}
              >
                <ImageRounded sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                <Typography variant="body2" fontWeight={500}>
                  No Image Available
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Sidebar - Metadata & Actions */}
        <Grid item xs={12} lg={4}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: `1px solid ${theme.palette.divider}`,
              position: 'sticky',
              top: 20
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              Timeline & Metadata
            </Typography>

            <Stack spacing={3}>
              {/* Creation Date */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.success.light, width: 40, height: 40 }}>
                  <CalendarTodayRounded fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Created Date
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formattedDates.createdAt}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {/* Last Update */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.info.light, width: 40, height: 40 }}>
                  <UpdateRounded fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Last Updated
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formattedDates.updatedAt}
                  </Typography>
                  {formattedDates.dateDiff && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      {formattedDates.dateDiff}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Divider />

              {/* Quick Actions */}
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 2 }}>
                  Quick Actions
                </Typography>
                <Stack spacing={1}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<EditRounded />}
                    onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                    sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
                  >
                    Edit Category
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<CategoryRounded />}
                    onClick={() => navigate("/admin/categories")}
                    sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
                  >
                    View All Categories
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Paper>

          {/* Status Card */}
          <Card 
            sx={{ 
              mt: 3, 
              borderRadius: 3,
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Category Status
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                This category is currently active and visible to users.
              </Typography>
              <Chip 
                label="Active" 
                color="success" 
                variant="filled"
                sx={{ 
                  bgcolor: 'white', 
                  color: theme.palette.primary.main,
                  fontWeight: 600
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}