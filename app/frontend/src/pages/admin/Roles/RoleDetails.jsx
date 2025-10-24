// src/pages/admin/Roles/RoleDetails.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Stack,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Container,
  alpha,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
  Update as UpdateIcon,
  Shield as ShieldIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import { fetchRoleById, deleteRole } from "../../../features/roles/rolesThunks";
import { fetchPermissions } from "../../../features/permissions/permissionsThunks";

const RoleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  // Redux state
  const { items: permissions } = useSelector((state) => state.permissions);
  const { loading: rolesLoading, error } = useSelector((state) => state.roles);

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Format permission name for display
  const formatPermissionName = (permissionName) => {
    if (!permissionName) return "";
    return permissionName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get action from permission name
  const getActionFromPermission = (permissionName) => {
    if (!permissionName) return "";
    const parts = permissionName.split("_");
    return parts[0] || "";
  };

  // Get action color
  const getActionColor = (action) => {
    const colors = {
      view: "info",
      create: "success",
      edit: "warning",
      update: "warning",
      delete: "error",
      manage: "primary",
      place: "secondary",
    };
    return colors[action] || "default";
  };

  // Group permissions by resource
  const groupPermissions = (permissionNames) => {
    if (!permissionNames || !Array.isArray(permissionNames)) {
      return [];
    }

    const groups = {};

    permissionNames.forEach((permissionName) => {
      const parts = permissionName.split("_");

      if (parts.length < 2) {
        if (!groups["general"]) {
          groups["general"] = {
            category: "General",
            permissions: [],
          };
        }
        groups["general"].permissions.push(permissionName);
        return;
      }

      const resource = parts.slice(1).join("_");

      if (!groups[resource]) {
        const displayName = resource
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        groups[resource] = {
          category: displayName,
          permissions: [],
        };
      }

      groups[resource].permissions.push(permissionName);
    });

    return Object.values(groups);
  };

  // Format date for better display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Fetch role and permissions data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch permissions first
        await dispatch(fetchPermissions()).unwrap();

        // Then fetch role data
        const result = await dispatch(fetchRoleById(id)).unwrap();
        const roleData = result.data || result;
        setRole(roleData);
      } catch (error) {
        console.error("Error loading role details:", error);
        enqueueSnackbar("Error loading role details", { variant: "error" });
        navigate("/admin/roles");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch, navigate, enqueueSnackbar]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteRole(id)).unwrap();
      enqueueSnackbar("Role deleted successfully!", { variant: "success" });
      navigate("/admin/roles");
    } catch (error) {
      console.error("Error deleting role:", error);
      enqueueSnackbar(error || "Failed to delete role", { variant: "error" });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/roles/edit/${id}`);
  };

  const handleBack = () => {
    navigate("/admin/roles");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading role details...
        </Typography>
      </Box>
    );
  }

  if (!role) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Role not found or you don't have permission to view it.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          variant="contained"
        >
          Back to Roles
        </Button>
      </Container>
    );
  }

  const permissionGroups = groupPermissions(role.permissions || []);
  const totalPermissions = role.permissions?.length || 0;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              variant="outlined"
              size="medium"
            >
              Back
            </Button>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              size="medium"
            >
              Edit Role
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
              size="medium"
            >
              Delete
            </Button>
          </Box>
        </Box>
        {/* Enhanced Stats Cards */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Card
            sx={{
              p: 2.5,
              flex: 1,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.1
              )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: 3,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <SecurityIcon color="primary" />
              <Box>
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {totalPermissions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Permissions
                </Typography>
              </Box>
            </Stack>
          </Card>

          <Card
            sx={{
              p: 2.5,
              flex: 1,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.success.main,
                0.1
              )} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
              borderRadius: 3,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <CategoryIcon color="success" />
              <Box>
                <Typography variant="h6" fontWeight={700} color="success.main">
                  {permissionGroups.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Permission Groups
                </Typography>
              </Box>
            </Stack>
          </Card>

          <Card
            sx={{
              p: 2.5,
              flex: 1,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.warning.main,
                0.1
              )} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
              borderRadius: 3,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <TrendingUpIcon color="warning" />
              <Box>
                <Typography variant="h6" fontWeight={700} color="warning.main">
                  {role.guard_name || "web"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Security Guard
                </Typography>
              </Box>
            </Stack>
          </Card>

          <Card
            sx={{
              p: 2.5,
              flex: 1,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.info.main,
                0.1
              )} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
              borderRadius: 3,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <PeopleIcon color="info" />
              <Box>
                <Typography variant="h6" fontWeight={700} color="info.main">
                  Active
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Role Status
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Role Information & Actions in One Row */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {/* Role Information - 70% */}
            <Grid item xs={12} lg={8}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 2,
                  height: "100%",
                  background: `linear-gradient(135deg, ${
                    theme.palette.background.paper
                  } 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    fontWeight={600}
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <SecurityIcon color="primary" />
                    Role Information
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          p: 3,
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 2,
                          bgcolor: "background.default",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Role Name
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{
                            fontFamily: "monospace",
                            color: "primary.main",
                          }}
                        >
                          {role.name}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          p: 3,
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 2,
                          bgcolor: "background.default",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Security Guard
                        </Typography>
                        <Chip
                          label={role.guard_name || "web"}
                          color="primary"
                          variant="filled"
                          sx={{ fontWeight: 600, fontSize: "0.9rem" }}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          p: 3,
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 2,
                          bgcolor: "background.default",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CalendarIcon fontSize="small" />
                          Created Date
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {formatDate(role.created_at)}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          p: 3,
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 2,
                          bgcolor: "background.default",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <UpdateIcon fontSize="small" />
                          Last Updated
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {formatDate(role.updated_at)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Permissions Section */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 2,
              background: `linear-gradient(135deg, ${
                theme.palette.background.paper
              } 0%, ${alpha(theme.palette.success.main, 0.02)} 100%)`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 4,
                }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  fontWeight={600}
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <CheckCircleIcon color="success" />
                  Assigned Permissions
                </Typography>
                <Chip
                  label={`${totalPermissions} permissions`}
                  color="primary"
                  variant="filled"
                  sx={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    height: 36,
                  }}
                />
              </Box>

              {!role.permissions || role.permissions.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  <Typography>
                    This role has no permissions assigned. Users with this role
                    will have basic access only.
                  </Typography>
                </Alert>
              ) : (
                <Box>
                  <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>
                    <Typography>
                      This role has <strong>{totalPermissions}</strong>{" "}
                      permissions across{" "}
                      <strong>{permissionGroups.length}</strong> categories.
                    </Typography>
                  </Alert>

                  {/* Permission Groups */}
                  <Stack spacing={3}>
                    {permissionGroups.map((group, groupIndex) => (
                      <Paper
                        key={group.category}
                        variant="outlined"
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          borderLeft: `4px solid ${theme.palette.primary.main}`,
                          background: `linear-gradient(135deg, ${alpha(
                            theme.palette.primary.main,
                            0.03
                          )} 0%, ${alpha(
                            theme.palette.primary.main,
                            0.01
                          )} 100%)`,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 3,
                          }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CategoryIcon color="primary" />
                            {group.category}
                          </Typography>
                          <Chip
                            label={`${group.permissions.length} permissions`}
                            size="medium"
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>

                        <Grid container spacing={2}>
                          {group.permissions.map(
                            (permissionName, permissionIndex) => {
                              const action =
                                getActionFromPermission(permissionName);
                              const actionColor = getActionColor(action);
                              const displayName =
                                formatPermissionName(permissionName);

                              return (
                                <Grid
                                  item
                                  xs={12}
                                  sm={6}
                                  md={4}
                                  key={`${groupIndex}-${permissionIndex}`}
                                >
                                  <Box
                                    sx={{
                                      p: 2,
                                      borderRadius: 2,
                                      border: 1,
                                      borderColor: "divider",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 2,
                                      bgcolor: "background.default",
                                      transition: "all 0.2s ease-in-out",
                                      "&:hover": {
                                        boxShadow: 1,
                                        transform: "translateY(-1px)",
                                      },
                                    }}
                                  >
                                    <CheckCircleIcon color="success" />
                                    <Chip
                                      label={action}
                                      size="small"
                                      color={actionColor}
                                      variant="filled"
                                      sx={{ fontWeight: 600, minWidth: 70 }}
                                    />
                                    <Typography
                                      variant="body2"
                                      fontWeight={500}
                                      sx={{ flex: 1 }}
                                    >
                                      {displayName.replace(action + " ", "")}
                                    </Typography>
                                  </Box>
                                </Grid>
                              );
                            }
                          )}
                        </Grid>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Confirm Role Deletion
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Are you sure you want to delete the role{" "}
            <strong>"{role.name}"</strong>? This action cannot be undone and may
            affect users assigned to this role.
          </Typography>
          {role.permissions && role.permissions.length > 0 && (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>Warning:</strong> This role has{" "}
                {role.permissions.length} permissions assigned. Users with this
                role will lose access to these features.
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
            variant="outlined"
            size="large"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={
              deleting ? <CircularProgress size={20} /> : <DeleteIcon />
            }
            size="large"
          >
            {deleting ? "Deleting..." : "Delete Role"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoleDetails;
