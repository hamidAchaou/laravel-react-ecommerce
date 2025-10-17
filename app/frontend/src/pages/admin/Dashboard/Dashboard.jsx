import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  useTheme,
  alpha,
  CircularProgress,
  Stack,
  Chip,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  People,
  AttachMoney,
  Refresh,
  Inventory,
  LocalShipping,
  CheckCircle,
  Schedule,
  Warning,
  Category,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../../features/products/productsThunks';
import { fetchCategories } from '../../../features/categories/categoriesThunks';
import { fetchOrders } from '../../../features/orders/ordersThunks';

// Simple Chart Components
const SimpleBarChart = ({ data, height = 200, color = 'primary' }) => {
  const theme = useTheme();
  
  const safeData = Array.isArray(data) ? data : [];
  const maxValue = safeData.length > 0 ? Math.max(...safeData.map(item => item.value)) : 1;

  return (
    <Box sx={{ height, display: 'flex', alignItems: 'end', gap: 1, p: 2 }}>
      {safeData.map((item, index) => (
        <Box key={item.label} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(item.value / maxValue) * 80}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            style={{
              width: '60%',
              background: `linear-gradient(180deg, ${theme.palette[color].main} 0%, ${alpha(theme.palette[color].main, 0.7)} 100%)`,
              borderRadius: '4px 4px 0 0',
              minHeight: '4px',
            }}
          />
          <Typography variant="caption" sx={{ mt: 1, fontWeight: 600 }}>
            {item.label}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.value}
          </Typography>
        </Box>
      ))}
      {safeData.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', width: '100%' }}>
          No data available
        </Typography>
      )}
    </Box>
  );
};

// Stat Card Component
const StatCard = ({ title, value, change, icon, color = 'primary', onClick }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card 
        sx={{ 
          cursor: onClick ? 'pointer' : 'default',
          background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(theme.palette[color].main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 25px ${alpha(theme.palette[color].main, 0.15)}`,
          }
        }}
        onClick={onClick}
      >
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography color="text.secondary" variant="overline" fontWeight={600}>
                {title}
              </Typography>
              <Typography variant="h4" component="div" fontWeight={700} sx={{ mt: 1 }}>
                {value}
              </Typography>
              {change !== undefined && (
                <Chip
                  icon={change > 0 ? <ArrowUpward /> : <ArrowDownward />}
                  label={`${change > 0 ? '+' : ''}${change}%`}
                  color={change > 0 ? 'success' : 'error'}
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette[color].main, 0.1),
                color: theme.palette[color].main,
                width: 60,
                height: 60,
              }}
            >
              {icon}
            </Avatar>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Helper function to generate sales data from orders
const generateSalesDataFromOrders = (orders) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  if (!Array.isArray(orders) || orders.length === 0) {
    // Return demo data if no orders
    return months.slice(0, 6).map((month, index) => ({
      label: month,
      value: Math.round(40 + (index * 5) + Math.random() * 20)
    }));
  }

  // Group orders by month for real data
  const monthlyData = {};
  const currentYear = new Date().getFullYear();
  
  orders.forEach(order => {
    const orderDate = new Date(order.created_at);
    const month = orderDate.getMonth();
    const year = orderDate.getFullYear();
    
    if (year === currentYear) {
      const monthKey = months[month];
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey]++;
    }
  });

  // Fill in missing months
  return months.slice(0, 6).map(month => ({
    label: month,
    value: monthlyData[month] || 0
  }));
};

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get data from Redux store - check the actual structure in Redux DevTools
  const productsState = useSelector((state) => state.products);
  const categoriesState = useSelector((state) => state.categories);
  const ordersState = useSelector((state) => state.orders);

  console.log('🔍 Redux State:', {
    products: productsState,
    categories: categoriesState,
    orders: ordersState
  });

  // Extract items with proper fallbacks for different API response structures
  const products = productsState?.items || [];
  const categories = categoriesState?.items || [];
  const orders = ordersState?.items || ordersState?.allIds?.map(id => ordersState.byId?.[id]) || [];

  const productsLoading = productsState?.loading || false;
  const categoriesLoading = categoriesState?.loading || false;
  const ordersLoading = ordersState?.loading || false;

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchOrders());
  }, [dispatch]);

  // Safe data calculation with proper error handling
  const dashboardData = useMemo(() => {
    console.log('📊 Processing data:', { 
      productsCount: products.length, 
      categoriesCount: categories.length, 
      ordersCount: orders.length 
    });

    const safeOrders = Array.isArray(orders) ? orders : [];
    const safeProducts = Array.isArray(products) ? products : [];
    const safeCategories = Array.isArray(categories) ? categories : [];

    // Calculate metrics from actual data
    const totalRevenue = safeOrders.reduce((sum, order) => {
      const orderTotal = order.total || order.total_amount || 0;
      return sum + parseFloat(orderTotal);
    }, 0);

    const pendingOrders = safeOrders.filter(order => {
      const status = order.status?.toLowerCase();
      return status === 'pending' || status === 'processing';
    }).length;

    const completedOrders = safeOrders.filter(order => {
      const status = order.status?.toLowerCase();
      return status === 'completed' || status === 'delivered';
    }).length;

    const lowStockProducts = safeProducts.filter(product => {
      const stock = product.stock || 0;
      return stock < 10;
    }).length;

    // Recent orders (last 5)
    const recentOrders = safeOrders
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 5);

    // Low stock items
    const lowStockItems = safeProducts
      .filter(product => {
        const stock = product.stock || 0;
        return stock < 5;
      })
      .slice(0, 5);

    // Generate sales data based on actual orders
    const salesData = generateSalesDataFromOrders(safeOrders);

    return {
      stats: {
        totalRevenue,
        totalOrders: safeOrders.length,
        totalProducts: safeProducts.length,
        totalCategories: safeCategories.length,
        pendingOrders,
        completedOrders,
        lowStockProducts,
      },
      salesData,
      recentOrders,
      lowStockItems,
    };
  }, [products, categories, orders]);

  const stats = [
    {
      title: 'TOTAL REVENUE',
      value: `$${dashboardData.stats.totalRevenue.toLocaleString()}`,
      change: dashboardData.stats.totalOrders > 0 ? 12.5 : 0,
      icon: <AttachMoney />,
      color: 'success',
      onClick: () => navigate('/admin/orders'),
    },
    {
      title: 'TOTAL ORDERS',
      value: dashboardData.stats.totalOrders,
      change: dashboardData.stats.totalOrders > 0 ? 8.3 : 0,
      icon: <ShoppingCart />,
      color: 'primary',
      onClick: () => navigate('/admin/orders'),
    },
    {
      title: 'TOTAL PRODUCTS',
      value: dashboardData.stats.totalProducts,
      change: dashboardData.stats.totalProducts > 0 ? 5.2 : 0,
      icon: <Inventory />,
      color: 'info',
      onClick: () => navigate('/admin/products'),
    },
    {
      title: 'CATEGORIES',
      value: dashboardData.stats.totalCategories,
      change: dashboardData.stats.totalCategories > 0 ? 3.1 : 0,
      icon: <Category />,
      color: 'warning',
      onClick: () => navigate('/admin/categories'),
    },
  ];

  const secondaryStats = [
    {
      title: 'PENDING ORDERS',
      value: dashboardData.stats.pendingOrders,
      icon: <Schedule />,
      color: 'warning',
    },
    {
      title: 'COMPLETED ORDERS',
      value: dashboardData.stats.completedOrders,
      icon: <CheckCircle />,
      color: 'success',
    },
    {
      title: 'LOW STOCK ITEMS',
      value: dashboardData.stats.lowStockProducts,
      icon: <Warning />,
      color: 'error',
    },
  ];

  const handleRefresh = () => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchOrders());
  };

  // Show loading state
  if (productsLoading || categoriesLoading || ordersLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading Dashboard...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Dashboard Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back! Here's what's happening with your store today.
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={productsLoading || categoriesLoading || ordersLoading}
            >
              Refresh Data
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Debug Info - Remove in production */}
      <Alert severity="info" sx={{ mb: 2 }}>
        Data Summary: {dashboardData.stats.totalProducts} Products, {dashboardData.stats.totalCategories} Categories, {dashboardData.stats.totalOrders} Orders
      </Alert>

      {/* Main Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.title}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Charts and Secondary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Sales Chart */}
        <Grid item xs={12} lg={8}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Orders Overview
              </Typography>
              <Chip label={`Last ${dashboardData.salesData.length} months`} color="primary" variant="outlined" />
            </Stack>
            <SimpleBarChart data={dashboardData.salesData} height={250} color="primary" />
          </Paper>
        </Grid>

        {/* Secondary Stats */}
        <Grid item xs={12} lg={4}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              height: '100%',
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
            }}
          >
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              Quick Stats
            </Typography>
            <Stack spacing={2}>
              {secondaryStats.map((stat) => (
                <Card key={stat.title} variant="outlined">
                  <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette[stat.color].main, 0.1),
                          color: theme.palette[stat.color].main,
                          width: 40,
                          height: 40,
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {stat.title}
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {stat.value}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity & Low Stock */}
      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} lg={6}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Recent Orders
              </Typography>
              <Button 
                size="small" 
                onClick={() => navigate('/admin/orders')}
                sx={{ textTransform: 'none' }}
              >
                View All
              </Button>
            </Stack>
            
            <List dense>
              {dashboardData.recentOrders.length > 0 ? (
                dashboardData.recentOrders.map((order) => (
                  <ListItem key={order.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                        <ShoppingCart sx={{ fontSize: 16 }} />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={`Order #${order.id}`}
                      secondary={`${order.customer_name || 'Customer'} - $${(order.total || order.total_amount || 0).toLocaleString()}`}
                    />
                    <Chip 
                      label={order.status || 'unknown'} 
                      size="small"
                      color={
                        order.status?.toLowerCase() === 'completed' ? 'success' :
                        order.status?.toLowerCase() === 'pending' ? 'warning' : 
                        order.status?.toLowerCase() === 'processing' ? 'info' : 'default'
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No recent orders
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Low Stock Alert */}
        <Grid item xs={12} lg={6}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Low Stock Alert
              </Typography>
              <Button 
                size="small" 
                onClick={() => navigate('/admin/products')}
                sx={{ textTransform: 'none' }}
              >
                Manage
              </Button>
            </Stack>
            
            <List dense>
              {dashboardData.lowStockItems.length > 0 ? (
                dashboardData.lowStockItems.map((product) => {
                  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
                  const imageUrl = primaryImage?.image_path || product.image_url;
                  
                  return (
                    <ListItem key={product.id} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar 
                          src={imageUrl} 
                          sx={{ width: 32, height: 32 }}
                        >
                          <Inventory sx={{ fontSize: 16 }} />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={product.title || product.name}
                        secondary={`Stock: ${product.stock || 0} units`}
                      />
                      <Chip 
                        label="Low Stock" 
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    </ListItem>
                  );
                })
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No low stock items
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;