// src/pages/admin/Users/UsersDetails.jsx
import React, { useEffect } from "react";
import { Box, Typography, Card, CardContent, Avatar, Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "../../../features/users/usersThunks";

const UsersDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUserById(id));
  }, [dispatch, id]);

  if (loading || !currentUser) return <Typography>Loading...</Typography>;

  const { name, email, role, created_at } = currentUser;

  return (
    <Box className="p-6 flex justify-center min-h-screen">
      <Card className="w-full max-w-lg shadow-md rounded-2xl border">
        <CardContent>
          <Stack alignItems="center" spacing={2}>
            <Avatar sx={{ width: 90, height: 90, fontSize: 32 }}>
              {name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              {name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {email}
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Role: <strong>{role}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Joined: {new Date(created_at).toLocaleDateString()}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UsersDetails;
