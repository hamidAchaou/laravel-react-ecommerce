// src/pages/admin/Users/UsersEdit.jsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "../../../features/users/usersThunks";
import UsersForm from "./UsersForm";

const UsersEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUserById(id));
  }, [dispatch, id]);

  if (loading || !currentUser) return <div>Loading...</div>;

  return <UsersForm mode="edit" defaultValues={currentUser} />;
};

export default UsersEdit;
