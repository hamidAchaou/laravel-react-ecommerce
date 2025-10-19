import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles, deleteRole } from "../../../features/roles/rolesThunks";
import DataTableToolbar from "../../../components/admin/DataTable/DataTableToolbar";

export default function ManageRoles() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { items: roles, loading, error } = useSelector((state) => state.roles);

  const [rows, setRows] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(roles)) {
      setRows(
        roles.map((role) => ({
          id: role.id,
          name: role.name,
          permissionsCount: role.permissions?.length || 0,
          usersCount: role.users?.length || 0,
        }))
      );
    }
  }, [roles]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!roleToDelete) return;
    try {
      await dispatch(deleteRole(roleToDelete.id)).unwrap();
      enqueueSnackbar(`Role "${roleToDelete.name}" deleted successfully`, { variant: "success" });
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
      dispatch(fetchRoles());
    } catch {
      enqueueSnackbar("Failed to delete role", { variant: "error" });
    }
  }, [dispatch, enqueueSnackbar, roleToDelete]);

  const columns = [
    { field: "name", headerName: "Role Name", flex: 1 },
    { field: "permissionsCount", headerName: "Permissions", width: 130 },
    { field: "usersCount", headerName: "Users", width: 130 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: (params) => [
        <Tooltip title="Edit Role" key="edit">
          <GridActionsCellItem
            icon={<EditIcon color="primary" />}
            label="Edit"
            component={RouterLink}
            to={`/admin/roles/edit/${params.id}`}
          />
        </Tooltip>,
        <Tooltip title="Delete Role" key="delete">
          <GridActionsCellItem
            icon={<DeleteIcon color="error" />}
            label="Delete"
            onClick={() => {
              setRoleToDelete(params.row);
              setDeleteDialogOpen(true);
            }}
          />
        </Tooltip>,
      ],
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/admin" underline="hover" color="inherit">
          Dashboard
        </Link>
        <Typography color="text.primary">Roles</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Roles Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/admin/roles/create"
          sx={{ borderRadius: 1.5, textTransform: "capitalize", fontWeight: 600 }}
        >
          Add New Role
        </Button>
      </Stack>

      {/* Card */}
      <Card elevation={3} sx={{ borderRadius: 2 }}>
        <CardContent>
          {loading ? (
            <Stack alignItems="center" py={4}>
              <CircularProgress />
            </Stack>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              autoHeight
              disableSelectionOnClick
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50]}
              disableMultipleColumnsSorting
              sortingOrder={["asc", "desc"]}
              sortModel={[]}
              sx={{
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                },
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete role "{roleToDelete?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
